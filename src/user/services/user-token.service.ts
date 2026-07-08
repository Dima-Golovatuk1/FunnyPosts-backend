import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { TokenType } from '@prisma/client';
import { UserService } from './user.service';
import { StringValue, ms } from '@/libs/common/utils/ms.util';
import * as crypto from 'crypto';

@Injectable()
export class UserTokenService {
    public constructor(
        private readonly prismaService: PrismaService,
        private readonly userService: UserService,
    ) {}

    public async createToken(
        email: string,
        token: string,
        type: TokenType,
        expiresIn: StringValue = '3min',
    ) {
        const user = await this.userService.findByEmail(email);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        await this.clearTokensByType(user.id, type);

        return this.prismaService.token.create({
            data: {
                userId: user.id,
                token,
                type,
                expiresAt: new Date(Date.now() + ms(expiresIn)),
            },
        });
    }

    public async findToken(token: string, userId: string) {
        return this.prismaService.token.findFirst({
            where: {
                userId,
                token,
            },
        });
    }

    public async clearTokenById(id: string) {
        return this.prismaService.token.delete({
            where: {
                id,
            },
        });
    }

    public async clearTokensByUserId(userId: string) {
        return this.prismaService.token.deleteMany({
            where: {
                userId,
            },
        });
    }

    public async clearTokensByType(userId: string, type: TokenType) {
        return this.prismaService.token.deleteMany({
            where: {
                userId,
                type,
            },
        });
    }

    public isExpired(expiresAt: Date) {
        return expiresAt.getTime() < Date.now();
    }
}
