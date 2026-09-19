import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString, Length, MinLength, Validate } from 'class-validator'
import { IsPasswordsMatchingConstraint } from 'src/libs/common/decorators/is-passwords-matching-constraint.decorator'

export class RegisterDto {
    @ApiProperty({})
    @IsString({message: 'name must be a string'})
    @IsNotEmpty({message: 'name can not be empty'})
    @Length(2, 60)
    name: string

    @ApiProperty({})
    @IsString({message: 'email must be a string'})
    @IsEmail({}, {message: 'wrong email form'})
    @IsNotEmpty({message: 'email can not be empty'})
    email: string

    @ApiProperty({})
    @IsString({message: 'password must be a string'})
    @IsNotEmpty({message: 'password can not be empty'})
    @MinLength(6, {message: 'password must have min 6 symbols'})
    password: string

    @ApiProperty({})
    @IsString({message: 'passwordRepeat must be a string'})
    @IsNotEmpty({message: 'passwordRepeat can not be empty'})
    @MinLength(6, {message: 'passwordRepeat must have min 6 symbols'})
    @Validate(IsPasswordsMatchingConstraint, {
        message: 'passwords did not match'
    })
    passwordRepeat: string
}