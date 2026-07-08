import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { UserTokenService } from './services/user-token.service';

@Module({
    imports: [PrismaModule],
    controllers: [UserController],
    providers: [UserService, UserTokenService],
    exports: [UserService, UserTokenService],
})
export class UserModule {}
