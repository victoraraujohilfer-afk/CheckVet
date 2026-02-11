import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateProtocolDto } from './create-protocol.dto';

export class UpdateProtocolDto extends PartialType(
  OmitType(CreateProtocolDto, ['items'] as const),
) {}
