import { Module } from '@nestjs/common';
import { UserChatService } from './services/user-chat.service';
import { UserChatGateway } from './gateways/user-chat.gateway';
import { UserChatController } from './controllers/chat.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { PrismaService } from '@/prisma/prisma.service';
import { UserService } from '@/user/services/user.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, JwtModule],
  controllers: [UserChatController],
  providers: [UserChatGateway, UserChatService, PrismaService, UserService],
})
export class UserChatModule {}
