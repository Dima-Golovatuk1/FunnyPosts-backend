import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class DescriptionDto{
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(500)
    description: string
}