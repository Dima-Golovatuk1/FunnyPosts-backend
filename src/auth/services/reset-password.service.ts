import { UserService } from '@/user/services/user.service';
import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { ResetPasswordSendDto } from '../dto/reset-password/reset-password-send.dto';
import * as crypto from 'crypto';
import { MailService } from '@/mail/mail.service';
import { UserTokenService } from '@/user/services/user-token.service';
import { TokenType } from '@prisma/client';
import { VerifyResetPasswordDto } from '../dto/reset-password/verify-reset-password-code.dto';
import { ResetPasswordDto } from '../dto/reset-password/reset-password.dto';

@Injectable()
export class ResetPasswordService {
    public constructor(
        private readonly userService: UserService,
        private readonly userTokenService: UserTokenService,
        private readonly mailService: MailService,
    ) {}

    public async sendCode(dto: ResetPasswordSendDto) {
        const { email } = dto;
        const user = await this.userService.findByEmail(email);

        if (!user) {
            throw new NotFoundException('Email is not found');
        }

        if (!user.isVerified) {
            throw new UnauthorizedException('Email is not verified');
        }

        const code = crypto.randomInt(100000, 999999).toString();

        await this.userTokenService.createToken(
            user.email,
            code,
            TokenType.PASSWORD_RESET_CODE,
        );

        await this.mailService.sendResetPassword(user.email, code);

        return {
            message: 'Code has been sent to tour email',
        };
    }

    public async verifyCode(dto: VerifyResetPasswordDto) {
        const { email, code } = dto;

        const user = await this.userService.findByEmail(email);

        if (!user) {
            throw new NotFoundException('Email is not found');
        }

        const token = await this.userTokenService.findToken(code, user.id);

        if (!token) {
            throw new UnauthorizedException('Invalid token type');
        }

        if (token.type !== TokenType.PASSWORD_RESET_CODE) {
            throw new UnauthorizedException('Invalid token type');
        }

        if (this.userTokenService.isExpired(token.expiresAt)) {
            throw new UnauthorizedException('Code has expired');
        }

        await this.userTokenService.clearTokenById(token.id);

        const resetToken = crypto.randomUUID();

        await this.userTokenService.createToken(
            user.email,
            resetToken,
            TokenType.PASSWORD_RESET_TOKEN,
            '10min',
        );

        return {
            resetToken,
        };
    }

    public async resetPassword(dto: ResetPasswordDto) {
        const { resetToken, email, password } = dto;

        const user = await this.userService.findByEmail(email);

        if (!user) {
            throw new NotFoundException('Email is not found');
        }

        const token = await this.userTokenService.findToken(
            resetToken,
            user.id,
        );

        if (!token) {
            throw new NotFoundException('Invalid token');
        }

        if (token.type !== TokenType.PASSWORD_RESET_TOKEN) {
            throw new UnauthorizedException('Invalid token type');
        }

        if (this.userTokenService.isExpired(token.expiresAt)) {
            throw new UnauthorizedException('Reset token has expired');
        }

        await this.userService.resetNewPassword(token.userId, password);

        await this.userTokenService.clearTokenById(token.id);

        return {
            message: 'Password changed successfully',
        };
    }

    public async resendCode(dto: ResetPasswordSendDto) {
        return await this.sendCode(dto);
    }
}
