import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

interface SendEmailOptions {
    to: string;
    subject: string;
    html: string;
    text?: string;
}

@Injectable()
export class EmailService {
    private transporter: Transporter;

    constructor(private configService: ConfigService) {
        this.createTransporter();
    }

    private createTransporter() {
        const emailService = this.configService.get<string>('EMAIL_SERVICE');

        if (emailService === 'gmail') {
            // Gmail
            this.transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: this.configService.get<string>('EMAIL_USER'),
                    pass: this.configService.get<string>('EMAIL_PASSWORD'),
                },
            });
        } else if (emailService === 'smtp') {
            // SMTP genérico
            this.transporter = nodemailer.createTransport({
                host: this.configService.get<string>('EMAIL_HOST'),
                port: this.configService.get<number>('EMAIL_PORT') || 587,
                secure: this.configService.get<boolean>('EMAIL_SECURE') || false,
                auth: {
                    user: this.configService.get<string>('EMAIL_USER'),
                    pass: this.configService.get<string>('EMAIL_PASSWORD'),
                },
            });
        } else {
            // Fallback: Ethereal (emails de teste - não entregam de verdade)
            console.warn('⚠️ EMAIL_SERVICE não configurado. Usando Ethereal (emails de teste).');
            this.transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                auth: {
                    user: 'test@ethereal.email',
                    pass: 'test',
                },
            });
        }
    }

    async sendEmail(options: SendEmailOptions): Promise<void> {
        const mailOptions = {
            from: this.configService.get<string>('EMAIL_FROM') || 'CheckVet <noreply@checkvet.com>',
            to: options.to,
            subject: options.subject,
            html: options.html,
            text: options.text,
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Email enviado:', info.messageId);

            // Em desenvolvimento, mostra preview URL
            if (this.configService.get('NODE_ENV') === 'development') {
                console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
            }
        } catch (error) {
            console.error('Erro ao enviar email:', error);
            throw new Error('Falha ao enviar email');
        }
    }

    async sendPasswordResetEmail(to: string, fullName: string, resetToken: string): Promise<void> {
        const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:8080';
        const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

        const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background-color: #f9f9f9;
              border-radius: 10px;
              padding: 30px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              color: #2563eb;
              font-size: 28px;
              font-weight: bold;
            }
            .content {
              background-color: white;
              padding: 25px;
              border-radius: 8px;
              margin-bottom: 20px;
            }
            .button {
              display: inline-block;
              padding: 12px 30px;
              background-color: #2563eb;
              color: white !important;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
              margin: 20px 0;
            }
            .button:hover {
              background-color: #1d4ed8;
            }
            .warning {
              background-color: #fef3c7;
              border-left: 4px solid #f59e0b;
              padding: 15px;
              margin-top: 20px;
              border-radius: 4px;
            }
            .footer {
              text-align: center;
              color: #666;
              font-size: 12px;
              margin-top: 30px;
            }
            .token-box {
              background-color: #f3f4f6;
              padding: 15px;
              border-radius: 5px;
              font-family: monospace;
              word-break: break-all;
              margin: 15px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🐾 CheckVet</div>
            </div>
            
            <div class="content">
              <h2 style="color: #2563eb;">Recuperação de Senha</h2>
              
              <p>Olá, <strong>${fullName}</strong>!</p>
              
              <p>Recebemos uma solicitação para redefinir a senha da sua conta no CheckVet.</p>
              
              <p>Para criar uma nova senha, clique no botão abaixo:</p>
              
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Redefinir Senha</a>
              </div>
              
              <p style="font-size: 14px; color: #666;">
                Ou copie e cole o link abaixo no seu navegador:
              </p>
              <div class="token-box">
                ${resetUrl}
              </div>
              
              <div class="warning">
                <strong>⏰ Atenção:</strong> Este link expira em <strong>1 hora</strong>.
              </div>
              
              <p style="margin-top: 20px; font-size: 14px; color: #666;">
                Se você não solicitou a recuperação de senha, ignore este email. 
                Sua senha permanecerá inalterada.
              </p>
            </div>
            
            <div class="footer">
              <p>CheckVet - Sistema de Gestão Veterinária</p>
              <p>Este é um email automático, por favor não responda.</p>
            </div>
          </div>
        </body>
      </html>
    `;

        const text = `
      Recuperação de Senha - CheckVet
      
      Olá, ${fullName}!
      
      Recebemos uma solicitação para redefinir a senha da sua conta no CheckVet.
      
      Para criar uma nova senha, acesse o link abaixo:
      ${resetUrl}
      
      ATENÇÃO: Este link expira em 1 hora.
      
      Se você não solicitou a recuperação de senha, ignore este email.
      Sua senha permanecerá inalterada.
      
      ---
      CheckVet - Sistema de Gestão Veterinária
      Este é um email automático, por favor não responda.
    `;

        await this.sendEmail({
            to,
            subject: '🔑 Recuperação de Senha - CheckVet',
            html,
            text,
        });
    }

    async sendPasswordChangedConfirmation(to: string, fullName: string): Promise<void> {
        const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background-color: #f9f9f9;
              border-radius: 10px;
              padding: 30px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              color: #10b981;
              font-size: 28px;
              font-weight: bold;
            }
            .content {
              background-color: white;
              padding: 25px;
              border-radius: 8px;
              margin-bottom: 20px;
            }
            .success-icon {
              text-align: center;
              font-size: 48px;
              margin: 20px 0;
            }
            .warning {
              background-color: #fee2e2;
              border-left: 4px solid #ef4444;
              padding: 15px;
              margin-top: 20px;
              border-radius: 4px;
            }
            .footer {
              text-align: center;
              color: #666;
              font-size: 12px;
              margin-top: 30px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🐾 CheckVet</div>
            </div>
            
            <div class="content">
              <div class="success-icon">✅</div>
              
              <h2 style="color: #10b981; text-align: center;">Senha Alterada com Sucesso!</h2>
              
              <p>Olá, <strong>${fullName}</strong>!</p>
              
              <p>Sua senha foi alterada com sucesso.</p>
              
              <p>A partir de agora, você pode fazer login no CheckVet usando sua nova senha.</p>
              
              <div class="warning">
                <strong>🔒 Segurança:</strong> Se você não realizou esta alteração, 
                entre em contato imediatamente com o suporte.
              </div>
            </div>
            
            <div class="footer">
              <p>CheckVet - Sistema de Gestão Veterinária</p>
              <p>Este é um email automático, por favor não responda.</p>
            </div>
          </div>
        </body>
      </html>
    `;

        const text = `
      Senha Alterada com Sucesso - CheckVet
      
      Olá, ${fullName}!
      
      Sua senha foi alterada com sucesso.
      
      A partir de agora, você pode fazer login no CheckVet usando sua nova senha.
      
      SEGURANÇA: Se você não realizou esta alteração, entre em contato 
      imediatamente com o suporte.
      
      ---
      CheckVet - Sistema de Gestão Veterinária
      Este é um email automático, por favor não responda.
    `;

        await this.sendEmail({
            to,
            subject: '✅ Senha Alterada - CheckVet',
            html,
            text,
        });
    }
}