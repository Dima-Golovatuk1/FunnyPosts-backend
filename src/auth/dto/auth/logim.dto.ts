import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class LoginDto {
    @ApiProperty({})
    @IsString({ message: 'email must be a string' })
    @IsEmail({}, { message: 'wrong email form' })
    @IsNotEmpty({ message: 'email can not be empty' })
    email: string;

    @ApiProperty({})
    @IsString({ message: 'password must be a string' })
    @IsNotEmpty({ message: 'password can not be empty' })
    @MinLength(6, { message: 'password must have min 6 symbols' })
    password: string;

    // @IsOptional()
    // @IsString()
    // code: string
}
