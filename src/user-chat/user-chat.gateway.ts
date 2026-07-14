import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { UserChatService } from './user-chat.service';

@WebSocketGateway()
export class UserChatGateway {
  constructor(private readonly userChatService: UserChatService) {}

}
