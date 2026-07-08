import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class VerifyTwoFactorDto {
    @ApiProperty({})
    @IsString({ message: 'email must be a string' })
    @IsEmail({}, { message: 'wrong email form' })
    @IsNotEmpty({ message: 'email can not be empty' })
    email: string;

    @ApiProperty({})
    @Length(6, 6, { message: 'code must be exactly 8 characters long' })
    @IsString({ message: 'code must be a string' })
    @IsNotEmpty({ message: 'code can not be empty' })
    code: string;
}