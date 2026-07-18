import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    WebSocketServer,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserChatService } from '../services/user-chat.service';
import { JoinChatDto } from '../dto/join-chat.dto';
import { SendMessageDto } from '../dto/send-message.dto';
import { AuthenticatedSocket } from '../interfaces/auth-socket.interface';

@WebSocketGateway({
    cors: {
        origin: process.env.ALLOWED_ORIGIN || '*',
    },
})
export class UserChatGateway {
    constructor(private readonly userChatservice: UserChatService) {}

    @WebSocketServer()
    server: Server;

    async handleConnection(socket: AuthenticatedSocket) {
        const userId = socket.request.session.userId;

        console.log('userId =', userId);

        if (!userId) {
            socket.disconnect();
            return;
        }

        socket.userId = userId;

        console.log(`${userId} connected`);
    }

    @SubscribeMessage('message')
    async handleMessage(
        @ConnectedSocket() socket: AuthenticatedSocket,
        @MessageBody() data: any,
    ) {
        console.log(data);
    }

    @SubscribeMessage('join')
    async joinChat(
        @ConnectedSocket() socket: AuthenticatedSocket,
        @MessageBody() dto: JoinChatDto,
    ) {
        await socket.join(dto.chatId);

        console.log(socket.id, 'joined', dto.chatId);

        console.log(this.server.sockets.adapter.rooms.get(dto.chatId));
    }

    @SubscribeMessage('leave')
    async leaveChat(
        @ConnectedSocket() socket: AuthenticatedSocket,
        @MessageBody() dto: JoinChatDto,
    ) {
        await socket.leave(dto.chatId);

        console.log(`${socket.id} left ${dto.chatId}`);
    }

    @SubscribeMessage('send-message')
    async sendMessage(
        @ConnectedSocket() socket: AuthenticatedSocket,
        @MessageBody() dto: SendMessageDto,
    ) {
        const message = await this.userChatservice.sendMessage(
            dto.chatId,
            socket.userId,
            dto.text,
        );

        this.server.to(dto.chatId).emit('new-message', {
            message,
        });
    }
}
