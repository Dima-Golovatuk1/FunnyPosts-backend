import { MailService } from '@/mail/mail.service';
import { UserTokenService } from '@/user/services/user-token.service';
import { UserService } from '@/user/services/user.service';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TokenType } from '@prisma/client';
import { Response } from 'express';
import * as crypto from 'crypto'

@Injectable()
export class VerificationService {
    public constructor(
        public readonly userSevice: UserService,
        public readonly userTokenService: UserTokenService,
        public readonly mailService: MailService,
        public readonly configService: ConfigService,
    ) {}

    public async sendVerification(email: string) {
        const user = await this.userSevice.findByEmail(email);

        await this.userSevice.isUserByEmail(email);

        if (user.isVerified) {
            throw new UnauthorizedException('Email already verified');
        }

        const token = crypto.randomUUID();

        await this.userTokenService.createToken(
            user.email,
            token,
            TokenType.VERIFICATION,
        );

        await this.mailService.sendVerificationEmail(user.email, token);
    }

    public async verifyEmail(token: string, email: string, res: Response) {
        const user = await this.userSevice.findByEmail(email)

        const verificationToken = await this.userTokenService.findToken(token, user.id);

        if (!verificationToken) {
            throw new NotFoundException('Invalid token');
        }

        if (
            verificationToken.type !== TokenType.VERIFICATION
        ) {
            throw new UnauthorizedException('Invalid verification token');
        }

        if(await this.userTokenService.isExpired(verificationToken.expiresAt)){
            throw new UnauthorizedException('Verification token has expired')
        }

        await this.userSevice.verifyUser(verificationToken.userId);

        await this.userTokenService.clearTokenById(verificationToken.id)

        return res.redirect(
            `${this.configService.getOrThrow<string>('ALLOWED_ORIGIN')}/auth/verify-email`,
        );
    }

    public async resendVerification(email: string) {
        return await this.sendVerification(email)
    }
}
