import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { IS_DEV_ENV } from './libs/common/utils/is-dev.util';
import { AccountModule } from './account/account.module';
import { MailModule } from './mail/mail.module';
import { PostModule } from './post/post.module';
import { UserChatModule } from './user-chat/user-chat.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            ignoreEnvFile: !IS_DEV_ENV,
            isGlobal: true,
        }),
        PrismaModule,
        UserModule,
        AuthModule,
        AccountModule,
        MailModule,
        PostModule,
        UserChatModule,
    ],
})
export class AppModule {}
