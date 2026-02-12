import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import { Readable } from 'stream';
import * as path from 'path';
import * as fs from 'fs';

interface ConsultationPDFData {
  id: string;
  patient: {
    name: string;
    species: string;
    breed?: string | null;
    gender: string;
    age?: string | null;
    weight?: number | null;
  };
  owner: {
    fullName: string;
    phone: string;
    email?: string | null;
    address?: string | null;
  };
  veterinarian: {
    fullName: string;
    crmv?: string | null;
    specialization?: string | null;
    clinicName?: string | null;
    clinicLogoUrl?: string | null;
  };
  type: string;
  status: string;
  date: Date;
  chiefComplaint?: string | null;
  adherencePercentage?: number | null;
  protocol?: {
    name: string;
    description?: string | null;
  } | null;
  checklist?: Array<{
    id: string;
    name: string;
    completed: boolean;
    completedAt?: Date | null;
    notes?: string | null;
  }>;
  soapNote?: {
    subjective?: string | null;
    objectiveData?: any;
    assessment?: string | null;
    plan?: string | null;
  } | null;
  procedures?: Array<{
    name: string;
    code?: string | null;
    value?: number | null;
  }>;
}

@Injectable()
export class PDFService {
  private readonly COLORS = {
    primary: '#2563EB', // Azul CheckVet
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    darkText: '#1F2937',
    lightText: '#6B7280',
    border: '#E5E7EB',
    background: '#F9FAFB',
  };

  private readonly FONTS = {
    bold: 'Helvetica-Bold',
    normal: 'Helvetica',
    italic: 'Helvetica-Oblique',
  };

  async generateConsultationPDF(
    consultation: ConsultationPDFData,
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          margins: { top: 50, bottom: 50, left: 50, right: 50 },
          info: {
            Title: `Prontuário - ${consultation.patient.name}`,
            Author: 'CheckVet',
            Subject: `Consulta ${consultation.type}`,
            Creator: 'CheckVet System',
          },
        });

        const chunks: Buffer[] = [];

        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', (error) => {
          console.error('PDF generation error:', error);
          reject(error);
        });

        // Renderizar o PDF
        this.renderPDF(doc, consultation);

        doc.end();
      } catch (error) {
        console.error('Error in generateConsultationPDF:', error);
        reject(error);
      }
    });
  }

  private renderPDF(doc: PDFKit.PDFDocument, data: ConsultationPDFData) {
    // Cabeçalho com logo
    this.renderHeader(doc, data);

    // Linha separadora
    this.drawLine(doc, doc.y + 10);

    doc.moveDown(1);

    // Informações principais do paciente
    this.renderPatientInfo(doc, data);

    doc.moveDown(1);

    // Informações da consulta
    this.renderConsultationInfo(doc, data);

    doc.moveDown(1);

    // Dados do tutor
    this.renderOwnerInfo(doc, data);

    doc.moveDown(1);

    // Nota SOAP (se existir)
    if (data.soapNote) {
      this.renderSOAPNote(doc, data.soapNote);
      doc.moveDown(1);
    }

    // Checklist do protocolo (se existir)
    if (data.checklist && data.checklist.length > 0) {
      this.renderChecklist(doc, data);
      doc.moveDown(1);
    }

    // Procedimentos realizados (se existir)
    if (data.procedures && data.procedures.length > 0) {
      this.renderProcedures(doc, data.procedures);
      doc.moveDown(1);
    }

    // Campos de assinatura
    this.renderSignatureFields(doc, data);

    // Rodapé
    this.renderFooter(doc);
  }

  private renderHeader(doc: PDFKit.PDFDocument, data: ConsultationPDFData) {
    // Tentar carregar a logo da clínica se existir URL
    let clinicLogoLoaded = false;
    if (data.veterinarian.clinicLogoUrl) {
      try {
        // Se for URL http/https, tentar carregar
        if (
          data.veterinarian.clinicLogoUrl.startsWith('http://') ||
          data.veterinarian.clinicLogoUrl.startsWith('https://')
        ) {
          // Por enquanto, apenas marcar como não carregado para URLs remotas
          // Em produção, você pode implementar download da imagem
          clinicLogoLoaded = false;
        } else {
          // Se for caminho local
          if (fs.existsSync(data.veterinarian.clinicLogoUrl)) {
            doc.image(data.veterinarian.clinicLogoUrl, 50, 30, {
              width: 100,
              height: 60,
              fit: [100, 60],
            });
            clinicLogoLoaded = true;
          }
        }
      } catch (error) {
        console.warn('Erro ao carregar logo da clínica:', error);
      }
    }

    // Se a logo da clínica não foi carregada, mostrar nome da clínica
    if (!clinicLogoLoaded) {
      doc
        .font(this.FONTS.bold)
        .fontSize(18)
        .fillColor(this.COLORS.primary)
        .text(data.veterinarian.clinicName || 'CheckVet Hospital', 50, 35);
    }

    // Informações no canto direito
    const rightX = 400;
    doc
      .font(this.FONTS.bold)
      .fontSize(12)
      .fillColor(this.COLORS.darkText)
      .text('Prontuário Veterinário', rightX, 35, {
        width: 145,
        align: 'right',
      });

    doc
      .font(this.FONTS.normal)
      .fontSize(9)
      .fillColor(this.COLORS.lightText)
      .text(
        `Data: ${this.formatDate(data.date)} às ${this.formatTime(data.date)}`,
        rightX,
        50,
        { width: 145, align: 'right' },
      );

    doc
      .fontSize(8)
      .text(`ID: ${data.id.substring(0, 8).toUpperCase()}`, rightX, 63, {
        width: 145,
        align: 'right',
      });

    doc.moveDown(3);
  }

  private renderPatientInfo(
    doc: PDFKit.PDFDocument,
    data: ConsultationPDFData,
  ) {
    this.renderSectionTitle(doc, 'DADOS DO PACIENTE');

    const startY = doc.y;
    const leftColumn = 50;
    const rightColumn = 300;

    // Coluna esquerda
    doc
      .font(this.FONTS.bold)
      .fontSize(10)
      .fillColor(this.COLORS.lightText)
      .text('Nome do Paciente:', leftColumn, startY);

    doc
      .font(this.FONTS.bold)
      .fontSize(14)
      .fillColor(this.COLORS.darkText)
      .text(data.patient.name, leftColumn, startY + 15);

    // Coluna direita - Aderência
    if (data.adherencePercentage !== null && data.adherencePercentage !== undefined) {
      const adherence = data.adherencePercentage;
      const color =
        adherence >= 90
          ? this.COLORS.success
          : adherence >= 70
            ? this.COLORS.warning
            : this.COLORS.danger;

      doc
        .font(this.FONTS.bold)
        .fontSize(10)
        .fillColor(this.COLORS.lightText)
        .text('Aderência ao Protocolo:', rightColumn, startY);

      doc
        .font(this.FONTS.bold)
        .fontSize(20)
        .fillColor(color)
        .text(`${adherence}%`, rightColumn, startY + 12);
    }

    doc.moveDown(3);

    // Grade de informações
    const gridStartY = doc.y;
    const col1X = 50;
    const col2X = 200;
    const col3X = 350;

    // Linha 1
    this.renderInfoField(doc, 'Espécie', this.translateSpecies(data.patient.species), col1X, gridStartY);
    this.renderInfoField(doc, 'Raça', data.patient.breed || '—', col2X, gridStartY);
    this.renderInfoField(doc, 'Sexo', this.translateGender(data.patient.gender), col3X, gridStartY);

    doc.y = gridStartY + 35;

    // Linha 2
    this.renderInfoField(doc, 'Idade', data.patient.age || '—', col1X, doc.y);
    this.renderInfoField(
      doc,
      'Peso',
      data.patient.weight ? `${data.patient.weight} kg` : '—',
      col2X,
      doc.y,
    );

    doc.moveDown(2);
  }

  private renderConsultationInfo(
    doc: PDFKit.PDFDocument,
    data: ConsultationPDFData,
  ) {
    this.renderSectionTitle(doc, 'DADOS DA CONSULTA');

    const gridStartY = doc.y;
    const col1X = 50;
    const col2X = 200;
    const col3X = 350;

    // Linha 1
    this.renderInfoField(doc, 'Tipo de Consulta', this.translateConsultationType(data.type), col1X, gridStartY);
    this.renderInfoField(doc, 'Status', this.translateStatus(data.status), col2X, gridStartY);
    this.renderInfoField(doc, 'Protocolo', data.protocol?.name || '—', col3X, gridStartY);

    doc.y = gridStartY + 35;

    // Queixa principal (se houver)
    if (data.chiefComplaint) {
      doc.moveDown(1);
      this.renderInfoField(doc, 'Queixa Principal', data.chiefComplaint, col1X, doc.y, 495);
      doc.moveDown(2);
    }

    // Veterinário responsável
    doc.moveDown(1);
    const vetInfo = `${data.veterinarian.fullName}${data.veterinarian.crmv ? ` - CRMV: ${data.veterinarian.crmv}` : ''}`;
    this.renderInfoField(doc, 'Veterinário Responsável', vetInfo, col1X, doc.y, 495);

    doc.moveDown(2);
  }

  private renderOwnerInfo(
    doc: PDFKit.PDFDocument,
    data: ConsultationPDFData,
  ) {
    this.renderSectionTitle(doc, 'DADOS DO TUTOR');

    const gridStartY = doc.y;
    const col1X = 50;
    const col2X = 200;
    const col3X = 350;

    // Linha 1
    this.renderInfoField(doc, 'Nome Completo', data.owner.fullName, col1X, gridStartY, 135);
    this.renderInfoField(doc, 'Telefone', data.owner.phone, col2X, gridStartY, 135);
    if (data.owner.email) {
      this.renderInfoField(doc, 'E-mail', data.owner.email, col3X, gridStartY, 135);
    }

    doc.y = gridStartY + 35;

    // Endereço (se houver)
    if (data.owner.address) {
      doc.moveDown(1);
      this.renderInfoField(doc, 'Endereço', data.owner.address, col1X, doc.y, 495);
    }

    doc.moveDown(2);
  }

  private renderSOAPNote(
    doc: PDFKit.PDFDocument,
    soapNote: ConsultationPDFData['soapNote'],
  ) {
    if (!soapNote) return;

    this.renderSectionTitle(doc, 'NOTA SOAP');

    const contentX = 60;
    const labelWidth = 500;

    // S - Subjetivo
    if (soapNote.subjective) {
      doc
        .font(this.FONTS.bold)
        .fontSize(10)
        .fillColor(this.COLORS.primary)
        .text('S - SUBJETIVO', contentX, doc.y);

      doc
        .font(this.FONTS.normal)
        .fontSize(9)
        .fillColor(this.COLORS.darkText)
        .text(soapNote.subjective, contentX, doc.y + 5, {
          width: labelWidth,
          align: 'justify',
        });

      doc.moveDown(1.5);
    }

    // O - Objetivo
    if (soapNote.objectiveData) {
      doc
        .font(this.FONTS.bold)
        .fontSize(10)
        .fillColor(this.COLORS.primary)
        .text('O - OBJETIVO', contentX, doc.y);

      doc.font(this.FONTS.normal).fontSize(9).fillColor(this.COLORS.darkText);

      const objectiveEntries = Object.entries(soapNote.objectiveData);
      objectiveEntries.forEach(([key, value]) => {
        doc.text(`${key}: ${String(value)}`, contentX, doc.y + 5, {
          width: labelWidth,
        });
      });

      doc.moveDown(1.5);
    }

    // A - Avaliação
    if (soapNote.assessment) {
      doc
        .font(this.FONTS.bold)
        .fontSize(10)
        .fillColor(this.COLORS.primary)
        .text('A - AVALIAÇÃO', contentX, doc.y);

      doc
        .font(this.FONTS.normal)
        .fontSize(9)
        .fillColor(this.COLORS.darkText)
        .text(soapNote.assessment, contentX, doc.y + 5, {
          width: labelWidth,
          align: 'justify',
        });

      doc.moveDown(1.5);
    }

    // P - Plano
    if (soapNote.plan) {
      doc
        .font(this.FONTS.bold)
        .fontSize(10)
        .fillColor(this.COLORS.primary)
        .text('P - PLANO', contentX, doc.y);

      doc
        .font(this.FONTS.normal)
        .fontSize(9)
        .fillColor(this.COLORS.darkText)
        .text(soapNote.plan, contentX, doc.y + 5, {
          width: labelWidth,
          align: 'justify',
        });

      doc.moveDown(1);
    }
  }

  private renderChecklist(
    doc: PDFKit.PDFDocument,
    data: ConsultationPDFData,
  ) {
    if (!data.checklist) return;

    this.renderSectionTitle(doc, 'CHECKLIST DO PROTOCOLO');

    if (data.protocol?.name) {
      doc
        .font(this.FONTS.italic)
        .fontSize(9)
        .fillColor(this.COLORS.lightText)
        .text(`Protocolo: ${data.protocol.name}`, 50, doc.y);

      doc.moveDown(0.5);
    }

    const itemX = 60;
    const checkboxSize = 10;

    data.checklist.forEach((item, index) => {
      // Verifica se precisa criar nova página
      if (doc.y > 700) {
        doc.addPage();
      }

      const itemY = doc.y;

      // Checkbox
      doc
        .rect(itemX, itemY, checkboxSize, checkboxSize)
        .strokeColor(this.COLORS.border)
        .stroke();

      // Checkmark se completado
      if (item.completed) {
        doc
          .fillColor(this.COLORS.success)
          .fontSize(12)
          .text('✓', itemX + 1, itemY - 2);
      }

      // Nome do item
      doc
        .font(this.FONTS.normal)
        .fontSize(9)
        .fillColor(this.COLORS.darkText)
        .text(item.name, itemX + 20, itemY, { width: 400 });

      // Status e data
      const statusX = 480;
      if (item.completed && item.completedAt) {
        doc
          .font(this.FONTS.normal)
          .fontSize(8)
          .fillColor(this.COLORS.success)
          .text(
            `✓ ${this.formatDate(item.completedAt)} ${this.formatTime(item.completedAt)}`,
            statusX,
            itemY,
            { width: 80, align: 'right' },
          );
      } else {
        doc
          .font(this.FONTS.normal)
          .fontSize(8)
          .fillColor(this.COLORS.lightText)
          .text('Pendente', statusX, itemY, { width: 80, align: 'right' });
      }

      // Notas (se houver)
      if (item.notes) {
        doc
          .font(this.FONTS.italic)
          .fontSize(8)
          .fillColor(this.COLORS.lightText)
          .text(`Obs: ${item.notes}`, itemX + 20, doc.y + 5, { width: 460 });
      }

      doc.moveDown(0.8);
    });

    doc.moveDown(0.5);
  }

  private renderProcedures(
    doc: PDFKit.PDFDocument,
    procedures: ConsultationPDFData['procedures'],
  ) {
    if (!procedures) return;

    this.renderSectionTitle(doc, 'PROCEDIMENTOS REALIZADOS');

    const tableTop = doc.y;
    const itemX = 60;
    const codeX = 300;
    const valueX = 450;

    // Cabeçalho da tabela
    doc
      .font(this.FONTS.bold)
      .fontSize(9)
      .fillColor(this.COLORS.lightText)
      .text('Procedimento', itemX, tableTop)
      .text('Código', codeX, tableTop)
      .text('Valor', valueX, tableTop, { width: 90, align: 'right' });

    this.drawLine(doc, tableTop + 15);

    let currentY = tableTop + 20;
    let total = 0;

    procedures.forEach((proc) => {
      doc
        .font(this.FONTS.normal)
        .fontSize(9)
        .fillColor(this.COLORS.darkText)
        .text(proc.name, itemX, currentY, { width: 230 })
        .text(proc.code || '—', codeX, currentY)
        .text(
          proc.value != null ? this.formatCurrency(proc.value) : '—',
          valueX,
          currentY,
          { width: 90, align: 'right' },
        );

      if (proc.value) {
        total += proc.value;
      }

      currentY += 20;
    });

    this.drawLine(doc, currentY);

    // Total
    doc
      .font(this.FONTS.bold)
      .fontSize(10)
      .fillColor(this.COLORS.darkText)
      .text('TOTAL', itemX, currentY + 10)
      .text(this.formatCurrency(total), valueX, currentY + 10, {
        width: 90,
        align: 'right',
      });

    doc.moveDown(3);
  }

  private renderSignatureFields(
    doc: PDFKit.PDFDocument,
    data: ConsultationPDFData,
  ) {
    // Verifica se há espaço suficiente, senão cria nova página
    if (doc.y > 650) {
      doc.addPage();
    }

    doc.moveDown(2);

    const startY = doc.y;
    const col1X = 70;
    const col2X = 340;
    const signatureWidth = 180;

    // Campo de assinatura do veterinário
    doc
      .moveTo(col1X, startY)
      .lineTo(col1X + signatureWidth, startY)
      .strokeColor(this.COLORS.border)
      .stroke();

    doc
      .font(this.FONTS.normal)
      .fontSize(8)
      .fillColor(this.COLORS.lightText)
      .text('Assinatura do Veterinário', col1X, startY + 5, {
        width: signatureWidth,
        align: 'center',
      });

    doc
      .font(this.FONTS.bold)
      .fontSize(9)
      .fillColor(this.COLORS.darkText)
      .text(data.veterinarian.fullName, col1X, startY + 20, {
        width: signatureWidth,
        align: 'center',
      });

    if (data.veterinarian.crmv) {
      doc
        .font(this.FONTS.normal)
        .fontSize(8)
        .fillColor(this.COLORS.lightText)
        .text(`CRMV: ${data.veterinarian.crmv}`, col1X, startY + 35, {
          width: signatureWidth,
          align: 'center',
        });
    }

    // Campo de assinatura do tutor
    doc
      .moveTo(col2X, startY)
      .lineTo(col2X + signatureWidth, startY)
      .strokeColor(this.COLORS.border)
      .stroke();

    doc
      .font(this.FONTS.normal)
      .fontSize(8)
      .fillColor(this.COLORS.lightText)
      .text('Assinatura do Tutor', col2X, startY + 5, {
        width: signatureWidth,
        align: 'center',
      });

    doc
      .font(this.FONTS.bold)
      .fontSize(9)
      .fillColor(this.COLORS.darkText)
      .text(data.owner.fullName, col2X, startY + 20, {
        width: signatureWidth,
        align: 'center',
      });

    doc.moveDown(4);
  }

  private renderFooter(doc: PDFKit.PDFDocument) {
    // Adiciona rodapé apenas na última página (página atual)
    const pageCount = (doc as any).bufferedPageRange().count;

    // Linha superior do rodapé
    this.drawLine(doc, 760);

    // Tentar carregar a logo da CheckVet para o rodapé
    let checkvetLogoLoaded = false;
    const possibleLogoPaths = [
      path.join(__dirname, '../../assets/checkvet-logo.png'),
      path.join(__dirname, '../../../src/assets/checkvet-logo.png'),
      path.join(process.cwd(), 'src/assets/checkvet-logo.png'),
      path.join(process.cwd(), 'dist/assets/checkvet-logo.png'),
    ];

    for (const logoPath of possibleLogoPaths) {
      try {
        if (fs.existsSync(logoPath)) {
          // Logo da CheckVet no canto direito inferior
          doc.image(logoPath, 480, 765, { width: 60 });
          checkvetLogoLoaded = true;
          break;
        }
      } catch (error) {
        // Continua tentando outros caminhos
      }
    }

    // Texto do rodapé
    doc
      .font(this.FONTS.normal)
      .fontSize(8)
      .fillColor(this.COLORS.lightText)
      .text(
        'Este documento foi gerado eletronicamente',
        50,
        770,
        { width: 250, align: 'left' },
      );

    doc
      .fontSize(7)
      .text(`Página ${pageCount}`, 50, 782, {
        width: 100,
        align: 'left',
      });

    // Se a logo não carregou, adiciona texto "CheckVet" no canto direito
    if (!checkvetLogoLoaded) {
      doc
        .font(this.FONTS.bold)
        .fontSize(10)
        .fillColor(this.COLORS.primary)
        .text('CheckVet', 480, 775, {
          width: 65,
          align: 'right',
        });
    }

    doc
      .font(this.FONTS.normal)
      .fontSize(7)
      .fillColor(this.COLORS.lightText)
      .text(
        `Gerado em: ${this.formatDate(new Date())}`,
        300,
        782,
        { width: 240, align: 'right' },
      );
  }

  // Métodos auxiliares
  private renderSectionTitle(doc: PDFKit.PDFDocument, title: string) {
    const startY = doc.y;

    // Barra lateral colorida
    doc
      .rect(50, startY, 4, 15)
      .fillColor(this.COLORS.primary)
      .fill();

    // Título
    doc
      .font(this.FONTS.bold)
      .fontSize(11)
      .fillColor(this.COLORS.darkText)
      .text(title, 60, startY + 2);

    doc.moveDown(1.2);
  }

  private renderInfoField(
    doc: PDFKit.PDFDocument,
    label: string,
    value: string,
    x: number,
    y: number,
    width: number = 135,
  ) {
    doc
      .font(this.FONTS.bold)
      .fontSize(8)
      .fillColor(this.COLORS.lightText)
      .text(label, x, y);

    doc
      .font(this.FONTS.normal)
      .fontSize(9)
      .fillColor(this.COLORS.darkText)
      .text(value, x, y + 12, { width });
  }

  private drawLine(doc: PDFKit.PDFDocument, y: number) {
    doc
      .moveTo(50, y)
      .lineTo(545, y)
      .strokeColor(this.COLORS.border)
      .stroke();
  }

  // Formatação
  private formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('pt-BR');
  }

  private formatTime(date: Date): string {
    return new Date(date).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }

  // Traduções
  private translateSpecies(species: string): string {
    const translations: { [key: string]: string } = {
      CANINE: 'Canino',
      FELINE: 'Felino',
      AVIAN: 'Ave',
      EXOTIC: 'Exótico',
    };
    return translations[species] || species;
  }

  private translateGender(gender: string): string {
    const translations: { [key: string]: string } = {
      MALE: 'Macho',
      FEMALE: 'Fêmea',
    };
    return translations[gender] || gender;
  }

  private translateConsultationType(type: string): string {
    const translations: { [key: string]: string } = {
      ROUTINE: 'Consulta de Rotina',
      VACCINATION: 'Vacinação',
      EMERGENCY: 'Emergência',
      SURGERY: 'Cirurgia',
      RETURN: 'Retorno',
      EXAM: 'Exame',
    };
    return translations[type] || type;
  }

  private translateStatus(status: string): string {
    const translations: { [key: string]: string } = {
      COMPLETED: 'Concluída',
      PENDING: 'Pendente',
      IN_PROGRESS: 'Em Andamento',
    };
    return translations[status] || status;
  }
}
