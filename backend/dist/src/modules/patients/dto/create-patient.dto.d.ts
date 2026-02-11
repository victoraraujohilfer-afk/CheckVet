import { Species, Gender } from '@prisma/client';
export declare class CreatePatientDto {
    name: string;
    ownerId: string;
    species: Species;
    breed?: string;
    gender: Gender;
    age?: string;
    weight?: number;
}
