import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Provider } from '@prisma/client';

@Injectable()
export class AccountService {
    constructor(
        private readonly prisma:PrismaService
    ){}

    async findGoogleAccount(providerId: string) {
        return this.prisma.account.findFirst({
            where: {
                provider: Provider.GOOGLE,
                providerId,
            },
            include: {
                user: true,
            }
        })
    }

    async createGoogleAccount(
        userId: string,
        providerId: string,
        accessToken: string,
        refreshToken: string | undefined,
    ){
        return this.prisma.account.create({
            data: {
                provider: Provider.GOOGLE,
                providerId,
                type: 'OAUTH',
                accessToken,
                refreshToken,
                expiresAt: 0,
                user: {
                    connect: {
                        id: userId
                    }
                }
            }
        })
    }
}
