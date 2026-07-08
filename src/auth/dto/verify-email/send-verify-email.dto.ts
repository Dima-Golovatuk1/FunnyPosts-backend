import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SendVerifyEmail{
        @ApiProperty({})
        @IsString({message: 'email must be a string'})
        @IsEmail({}, {message: 'wrong email form'})
        @IsNotEmpty({message: 'email can not be empty'})
        email: string
}