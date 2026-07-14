import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetPostsDto {
    @ApiPropertyOptional({ description: 'ID last post', type: String })
    @IsOptional()
    cursor?: string;

    @ApiPropertyOptional({
        description: 'quantity posts',
        type: Number,
        default: 10,
        minimum: 1,
        maximum: 50,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(50)
    limit = 10;
}
