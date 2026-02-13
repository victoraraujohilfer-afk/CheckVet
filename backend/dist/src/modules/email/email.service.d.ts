import { ConfigService } from '@nestjs/config';
interface SendEmailOptions {
    to: string;
    subject: string;
    html: string;
    text?: string;
}
export declare class EmailService {
    private configService;
    private transporter;
    constructor(configService: ConfigService);
    private createTransporter;
    sendEmail(options: SendEmailOptions): Promise<void>;
    sendPasswordResetEmail(to: string, fullName: string, resetToken: string): Promise<void>;
    sendPasswordChangedConfirmation(to: string, fullName: string): Promise<void>;
}
export {};
