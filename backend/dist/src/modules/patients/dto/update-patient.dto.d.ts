import { CreatePatientDto } from './create-patient.dto';
declare const UpdatePatientDto_base: import("@nestjs/mapped-types").MappedType<Partial<Omit<CreatePatientDto, "ownerId">>>;
export declare class UpdatePatientDto extends UpdatePatientDto_base {
}
export {};
