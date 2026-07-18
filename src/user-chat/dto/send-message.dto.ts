import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, Length } from 'class-validator';

export class SendMessageDto {
    @ApiProperty()
    @IsUUID()
    chatId: string;

    @ApiProperty()
    @IsString()
    @Length(1, 5000)
    text: string;
}
