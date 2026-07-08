import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { UserService } from '@/user/services/user.service';
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getRecaptchaConfig } from '@/config/recaptcha.config';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './strategies/google.strategy';
import { OAuthService } from './services/oauth.service';
import { AccountModule } from '@/account/account.module';
import { MailModule } from '@/mail/mail.module';
import { UserTokenService } from '@/user/services/user-token.service';
import { VerificationController } from './controllers/verification.controller';
import { VerificationService } from './services/verification.service';
import { OauthController } from './controllers/oauth.controller';
import { ResetPasswordController } from './controllers/reset-password.controller';
import { ResetPasswordService } from './services/reset-password.service';
import { TwoFactorService } from './services/two-factor.service';
import { SessionService } from './services/session.service';
import { TwoFactorController } from './controllers/two-factor.controller';

@Module({
    imports: [
        AccountModule,
        PassportModule,
        ConfigModule,
        MailModule,
        GoogleRecaptchaModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: getRecaptchaConfig,
            inject: [ConfigService],
        }),
    ],

    controllers: [
        AuthController,
        VerificationController,
        OauthController,
        ResetPasswordController,
        TwoFactorController,
    ],

    providers: [
        AuthService,
        OAuthService,
        ResetPasswordService,
        SessionService,
        TwoFactorService,
        VerificationService,
        UserService,
        UserTokenService,
        GoogleStrategy,
    ],
})
export class AuthModule {}
