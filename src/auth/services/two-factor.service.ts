import { UserTokenService } from '@/user/services/user-token.service';
import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { VerifyTwoFactorDto } from '../dto/two-factor-service/verify-two-factor.dto';
import * as crypto from 'crypto';
import { TokenType, User } from '@prisma/client';
import { MailService } from '@/mail/mail.service';
import { UserService } from '@/user/services/user.service';
import { SessionService } from './session.service';
import { Request } from 'express';

@Injectable()
export class TwoFactorService {
    public constructor(
        public readonly userTokenService: UserTokenService,
        private readonly sessionService: SessionService,
        public readonly mailService: MailService,
        public readonly userService: UserService,
    ) {}

    public async sendCode(user: User) {
        const code = crypto.randomInt(100000, 999999).toString();

        await this.userTokenService.createToken(
            user.email,
            code,
            TokenType.TWO_FACTOR,
            '3min',
        );

        await this.mailService.sendTwoFactorCode(user.email, code);

        return {
            message: 'Two-factor code has been sent',
        };
    }

    public async verifyCode(dto: VerifyTwoFactorDto, req: Request) {
        const { email, code } = dto;

        const user = await this.userService.findByEmail(email);

        if (!user) {
            throw new NotFoundException('Email is not found');
        }

        if (!user.isVerified) {
            throw new UnauthorizedException('Email is not verified');
        }

        const token = await this.userTokenService.findToken(code, user.id);

        if (!token) {
            throw new UnauthorizedException('Invalid token code');
        }

        if (token.type !== TokenType.TWO_FACTOR) {
            throw new UnauthorizedException('Invalid token type');
        }

        if (this.userTokenService.isExpired(token.expiresAt)) {
            throw new UnauthorizedException('Code has expired');
        }

        await this.userTokenService.clearTokenById(token.id);

        return await this.sessionService.saveSession(req, user);
    }
}
