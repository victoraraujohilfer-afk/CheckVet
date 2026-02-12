import { Module } from '@nestjs/common';
import { ConsultationsService } from './consultations.service';
import { ConsultationsController } from './consultations.controller';
import { PDFService } from './pdf.service';

@Module({
  controllers: [ConsultationsController],
  providers: [ConsultationsService, PDFService],
  exports: [ConsultationsService],
})
export class ConsultationsModule {}
