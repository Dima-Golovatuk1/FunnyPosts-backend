import { ApiProperty } from '@nestjs/swagger';
import {
    IsArray,
    IsNotEmpty,
    IsOptional,
    IsString,
    Length,
} from 'class-validator';

export class CreatePostDto {
    @ApiProperty()
    @IsString()
    @Length(2, 60)
    @IsNotEmpty()
    title: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    @Length(3, 5000)
    description?: string;
}
