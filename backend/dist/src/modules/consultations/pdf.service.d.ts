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
export declare class PDFService {
    private readonly COLORS;
    private readonly FONTS;
    generateConsultationPDF(consultation: ConsultationPDFData): Promise<Buffer>;
    private renderPDF;
    private renderHeader;
    private renderPatientInfo;
    private renderConsultationInfo;
    private renderOwnerInfo;
    private renderSOAPNote;
    private renderChecklist;
    private renderProcedures;
    private renderSignatureFields;
    private renderFooter;
    private renderSectionTitle;
    private renderInfoField;
    private drawLine;
    private formatDate;
    private formatTime;
    private formatCurrency;
    private translateSpecies;
    private translateGender;
    private translateConsultationType;
    private translateStatus;
}
export {};
