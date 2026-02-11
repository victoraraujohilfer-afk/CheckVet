import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async get() {
    let settings = await this.prisma.systemSettings.findUnique({
      where: { id: 'default' },
    });

    if (!settings) {
      settings = await this.prisma.systemSettings.create({
        data: { id: 'default' },
      });
    }

    return settings;
  }

  async update(dto: UpdateSettingsDto) {
    return this.prisma.systemSettings.upsert({
      where: { id: 'default' },
      update: dto,
      create: { id: 'default', ...dto },
    });
  }
}
