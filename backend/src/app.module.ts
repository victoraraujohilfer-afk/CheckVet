import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { OwnersModule } from './modules/owners/owners.module';
import { PatientsModule } from './modules/patients/patients.module';
import { ProtocolsModule } from './modules/protocols/protocols.module';
import { ConsultationsModule } from './modules/consultations/consultations.module';
import { SoapNotesModule } from './modules/soap-notes/soap-notes.module';
import { ProceduresModule } from './modules/procedures/procedures.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { SettingsModule } from './modules/settings/settings.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    PrismaModule,
    AuthModule,
    UsersModule,
    OwnersModule,
    PatientsModule,
    ProtocolsModule,
    ConsultationsModule,
    SoapNotesModule,
    ProceduresModule,
    AnalyticsModule,
    SettingsModule,
  ],
})
export class AppModule {}
