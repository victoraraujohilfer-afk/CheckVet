import { IsString, IsNotEmpty, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
    @ApiProperty({
        example: 'abc123def456...',
        description: 'Token de recuperação enviado por email'
    })
    @IsNotEmpty({ message: 'Token é obrigatório' })
    @IsString({ message: 'Token inválido' })
    token: string;

    @ApiProperty({
        example: 'NovaSenha@123',
        description: 'Nova senha (mínimo 6 caracteres, deve conter letra maiúscula, minúscula e número)'
    })
    @IsNotEmpty({ message: 'Senha é obrigatória' })
    @IsString({ message: 'Senha deve ser uma string' })
    @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
        message: 'A senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número',
    })
    newPassword: string;
}