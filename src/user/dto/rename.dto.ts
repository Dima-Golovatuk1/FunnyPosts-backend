import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RenameDto {
    @ApiProperty({})
    @IsString({ message: 'name must be a string' })
    @IsNotEmpty({ message: 'name can not be empty' })
    name: string;
}
