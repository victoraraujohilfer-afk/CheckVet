import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    get(): Promise<{
        id: string;
        updatedAt: Date;
        hospitalName: string;
        emailNotifications: boolean;
        smsNotifications: boolean;
        adherenceThreshold: number;
        autoBackup: boolean;
        backupFrequency: import(".prisma/client").$Enums.BackupFrequency;
        requireDocumentation: boolean;
        allowEditing: boolean;
    }>;
    update(dto: UpdateSettingsDto): Promise<{
        id: string;
        updatedAt: Date;
        hospitalName: string;
        emailNotifications: boolean;
        smsNotifications: boolean;
        adherenceThreshold: number;
        autoBackup: boolean;
        backupFrequency: import(".prisma/client").$Enums.BackupFrequency;
        requireDocumentation: boolean;
        allowEditing: boolean;
    }>;
}
