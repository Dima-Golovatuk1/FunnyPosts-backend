import { Authorization } from "@/auth/decorators/auth.decorator";
import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { UserChatService } from "../services/user-chat.service";
import { CreateChatDto } from "../dto/create-chat.dto";
import { Authorized } from "@/auth/decorators/authorized.decorator";
import { GetMessagesDto } from "../dto/get-messages.dto";

@Authorization()
@Controller('chat')
export class UserChatController{
    constructor(
        private readonly UserChatService: UserChatService
    ){}

    @Post('create')
    async create(
        @Body() dto: CreateChatDto,
        @Authorized('id') currentUserId: string
    ){
        return this.UserChatService.createChat(currentUserId, dto.userId)
    }

    @Get()
    async getAll(
        @Authorized('id') userId: string
    ){
        return this.UserChatService.getAllChats(userId)
    }

    @Get(':chatId/message')
    async getMessages(
        @Param('chatId') chatId: string,
        @Query() dto: GetMessagesDto,
        @Authorized('id') userId: string
    ){
        return this.UserChatService.getMessages(chatId, userId, dto)
    }
}