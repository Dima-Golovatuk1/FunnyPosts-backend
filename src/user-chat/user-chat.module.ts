import { Module } from '@nestjs/common';
import { UserChatService } from './user-chat.service';
import { UserChatGateway } from './user-chat.gateway';

@Module({
  providers: [UserChatGateway, UserChatService],
})
export class UserChatModule {}
