import { PartialType } from '@nestjs/mapped-types';
import { CreateSoapNoteDto } from './create-soap-note.dto';

export class UpdateSoapNoteDto extends PartialType(CreateSoapNoteDto) {}
