import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { render } from '@react-email/render';
import VerifyEmail from './templates/verify-email';
import ResetPassword from './templates/reset-password';
import TwoFactorCode from './templates/two-factor-code'

@Injectable()
export class MailService {
    private transporter: nodemailer.Transporter;

    public constructor(private readonly configService: ConfigService) {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: this.configService.getOrThrow<string>('EMAIL_USER'),
                pass: this.configService.getOrThrow<string>('EMAIL_PASS'),
            },
        });
    }

    async sendResetPassword(email: string, token: string) {
        const html = await render(ResetPassword({ token }));

        await this.transporter.sendMail({
            from: `"My App" <${this.configService.getOrThrow<string>(
                'EMAIL_USER',
            )}>`,
            to: email,
            subject: 'reset your password',
            html,
        });
    }

    async sendVerificationEmail(email: string, token: string) {
        const url = `${this.configService.getOrThrow<string>('APPLICATION_URL')}/verification/verify?token=${token}&email=${email}`;

        const html = await render(VerifyEmail({ url }));

        await this.transporter.sendMail({
            from: `"My App" <${this.configService.getOrThrow<string>(
                'EMAIL_USER',
            )}>`,
            to: email,
            subject: 'Verify your email',
            html,
        });
    }

    async sendTwoFactorCode(email: string, token: string) {
        const html = await render(TwoFactorCode({ token }));

        await this.transporter.sendMail({
            from: `"My App" <${this.configService.getOrThrow<string>(
                'EMAIL_USER',
            )}>`,
            to: email,
            subject: 'your code',
            html,
        });
    }
}
