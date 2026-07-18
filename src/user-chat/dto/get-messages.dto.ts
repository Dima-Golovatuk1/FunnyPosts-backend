import { ApiOperation, ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export class GetMessagesDto {
    @ApiProperty()
    @IsOptional()
    cursor?: string;

    @ApiProperty()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    @Transform(({ value }) => Number(value))
    limit = 30
}