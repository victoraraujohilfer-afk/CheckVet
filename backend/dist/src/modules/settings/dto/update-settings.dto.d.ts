import { BackupFrequency } from '@prisma/client';
export declare class UpdateSettingsDto {
    hospitalName?: string;
    emailNotifications?: boolean;
    smsNotifications?: boolean;
    adherenceThreshold?: number;
    autoBackup?: boolean;
    backupFrequency?: BackupFrequency;
    requireDocumentation?: boolean;
    allowEditing?: boolean;
}
