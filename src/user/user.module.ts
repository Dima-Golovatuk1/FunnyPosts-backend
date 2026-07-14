import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { UserTokenService } from './services/user-token.service';
import { UserProfileService } from './services/user-profile.service';
import { UserProfileController } from './controllers/user-profile.controller';
import { StorageModule } from '@/storage/storage.module';

@Module({
    imports: [PrismaModule, StorageModule],
    controllers: [UserController, UserProfileController],
    providers: [UserService, UserTokenService, UserProfileService],
    exports: [UserService, UserTokenService],
})
export class UserModule {}
