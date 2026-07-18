import { PrismaService } from '@/prisma/prisma.service';
import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { GetMessagesDto } from '../dto/get-messages.dto';

@Injectable()
export class UserChatService {
    constructor(public readonly prismaService: PrismaService) {}

    async createChat(firstUserId: string, secondUserId: string) {
        if (firstUserId === secondUserId) {
            throw new BadRequestException(
                'You cannot create a chat with yourself.',
            );
        }

        const user = await this.prismaService.user.findUnique({
            where: {
                id: secondUserId,
            },
        });

        if (!user) {
            throw new NotFoundException('User not found.');
        }

        const chats = await this.prismaService.chat.findMany({
            where: {
                members: {
                    some: {
                        userId: firstUserId,
                    },
                },
            },
            include: {
                members: true,
            },
        });

        const existingChat = chats.find((chat) => {
            if (chat.members.length !== 2) {
                return false;
            }

            return chat.members.some(
                (member) => member.userId === secondUserId,
            );
        });

        if (existingChat) {
            return existingChat;
        }

        return await this.prismaService.chat.create({
            data: {
                members: {
                    create: [
                        {
                            userId: firstUserId,
                        },
                        {
                            userId: secondUserId,
                        },
                    ],
                },
            },
            include: {
                members: true,
            },
        });
    }

    async getAllChats(userId: string) {
        const chats = await this.prismaService.chat.findMany({
            where: {
                members: {
                    some: {
                        userId,
                    },
                },
            },
            orderBy: {
                updatedAt: 'desc',
            },
            include: {
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                picture: true,
                            },
                        },
                    },
                },
                messages: {
                    orderBy: {
                        createdAt: 'desc',
                    },
                    take: 1,
                },
            },
        });

        return chats.map((chat) => {
            const companion = chat.members.find(
                (member) => member.userId !== userId,
            );

            return {
                id: chat.id,
                companion: companion?.user,
                lastMessage: chat.messages[0] ?? null,
            };
        });
    }

    async getMessages(chatId: string, userId: string, dto: GetMessagesDto) {
        const member = await this.prismaService.chatMember.findFirst({
            where: {
                chatId,
                userId,
            },
        });

        if (!member) {
            throw new ForbiddenException('You are not a member of this chat.');
        }

        const { cursor, limit } = dto;

        const messages = await this.prismaService.message.findMany({
            where: {
                chatId,
            },
            take: limit,

            ...(cursor && {
                cursor: {
                    id: cursor,
                },
                skip: 1,
            }),
            orderBy: [
                {
                    createdAt: 'desc',
                },

                {
                    id: 'desc',
                },
            ],
        });

        return {
            items: messages,

            nextCursor:
                messages.length === limit
                    ? messages[messages.length - 1].id
                    : null,
        };
    }

    async sendMessage(chatId: string, senderId: string, text: string) {
        const member = await this.prismaService.chatMember.findFirst({
            where: {
                chatId,
                userId: senderId,
            },
        });

        if (!member) {
            throw new ForbiddenException('You are not a member of this chat.');
        }

        return await this.prismaService.$transaction(async (tx) => {
            const message = await tx.message.create({
                data: {
                    chatId,
                    senderId,
                    text,
                },
                include: {
                    sender: {
                        select: {
                            id: true,
                            name: true,
                            picture: true,
                        },
                    },
                },
            });

            await tx.chat.update({
                where: {
                    id: chatId,
                },
                data: {
                    updatedAt: new Date(),
                },
            });

            return message;
        });
    }
}
