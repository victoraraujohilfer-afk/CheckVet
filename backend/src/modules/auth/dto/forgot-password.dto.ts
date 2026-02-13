import { IsEmail, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
    @ApiProperty({
        example: 'usuario@checkvet.com',
        description: 'Email do usuário que deseja recuperar a senha'
    })
    @IsNotEmpty({ message: 'Email é obrigatório' })
    @IsEmail({}, { message: 'Email inválido' })
    @Transform(({ value }) => value?.toLowerCase().trim())
    email: string;
}