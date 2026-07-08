import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from '../dto/auth/register.dto';
import { UserService } from '@/user/services/user.service';
import { AuthMethod, TokenType, User } from '@prisma/client';
import { Request, Response } from 'express';
import { LoginDto } from '../dto/auth/logim.dto';
import { verify } from 'argon2';
import { ConfigService } from '@nestjs/config';
import { GoogleUser } from '../interfaces/google-user.interface';
import { OAuthService } from './oauth.service';
import { MailService } from '@/mail/mail.service';
import * as crypto from 'node:crypto';
import { UserTokenService } from '@/user/services/user-token.service';
import { TwoFactorService } from './two-factor.service';
import { SessionService } from './session.service';

@Injectable()
export class AuthService {
    public constructor(
        private readonly userSevice: UserService,
        private readonly userTokenService: UserTokenService,
        private readonly configService: ConfigService,
        private readonly sessionService: SessionService,
        private readonly oauthService: OAuthService,
        private readonly twoFactorService: TwoFactorService,
        private readonly mailService: MailService,
    ) {}

    public async register(req: Request, dto: RegisterDto) {
        const isExists = await this.userSevice.findByEmail(dto.email);

        if (isExists) {
            throw new ConflictException('User with this email already exists');
        }

        const newUser = await this.userSevice.create(
            dto.email,
            dto.password,
            dto.name,
            '',
            AuthMethod.CREDENTIALS,
            false,
        );

        const token = crypto.randomUUID();

        await this.userTokenService.createToken(newUser.email, token, TokenType.VERIFICATION);

        await this.mailService.sendVerificationEmail(dto.email, token);

        return {
            message:
                'Registration successful. Please check your email to verify your account.',
        };
    }

    public async login(req: Request, dto: LoginDto) {
        const user = await this.userSevice.findByEmail(dto.email);

        if (!user || !user.password) {
            throw new NotFoundException('user not found');
        }

        const isValidPassword = await verify(user.password, dto.password);

        if (!isValidPassword) {
            throw new UnauthorizedException(
                'password is incorrect. If you foget password you can recover password',
            );
        }

        if (!user.isVerified) {
            throw new UnauthorizedException('Email is not verified');
        }

        if (user.isTwoFactorEnabled){
            return await this.twoFactorService.sendCode(user)
        }

        return this.sessionService.saveSession(req, user);
    }

    public async logout(req: Request, res: Response): Promise<void> {
        return new Promise((resolve, reject) => {
            req.session.destroy((error) => {
                if (error) {
                    return reject(
                        new InternalServerErrorException(
                            'failed to end session maybe the sessioon has already ended',
                        ),
                    );
                }

                res.clearCookie(
                    this.configService.getOrThrow<string>('SESSION_NAME'),
                );
                res.end();
                resolve();
            });
        });
    }

    public async googleLogin(req: Request, res: Response) {
        const googleUser = req.user as GoogleUser;

        const user = await this.oauthService.validateGoogleUser(googleUser);

        await this.sessionService.saveSession(req, user);

        return res.redirect(
            this.configService.getOrThrow<string>('ALLOWED_ORIGIN'),
        );
    }
}
