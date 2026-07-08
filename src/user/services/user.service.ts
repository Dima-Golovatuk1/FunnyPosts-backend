import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthMethod } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash } from 'argon2';
import { ms } from '@/libs/common/utils/ms.util';

@Injectable()
export class UserService {
    public constructor(private readonly prismaService: PrismaService) {}

    /**
     * find a user by their id
     * @param id unique UUID
     * @returns user and their accounts
     * @throws {NotFoundException} if user not found
     *
     * @example
     * const user = await userService.findById('a83b6b7b-c74e-4f95-87c7-d1dea86e07c3')
     */
    public async findById(id: string) {
        const user = await this.prismaService.user.findUnique({
            where: {
                id,
            },
            include: {
                accounts: true,
            },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    /**
     * find a user by their email
     * @param email user email
     * @returns user and their accounts
     *
     * @example
     * const user = await userService.findByEmail('example@gmail.com')
     */
    public async findByEmail(email: string) {
        const user = await this.prismaService.user.findUnique({
            where: {
                email,
            },
            include: {
                accounts: true,
            },
        });

        return user;
    }

    /**
     * create a user
     * @param email
     * @param password
     * @param name
     * @param picture
     * @param method
     * @param isVerified
     * @returns user and their accounts
     *
     * @example
     * const user = await userService.create(
     *      'example@gmail.com',
     *      '*******',
     *      'Dima',
     *      'example.png',
     *      GOOGLE,
     *      false
     * )
     */
    public async create(
        email: string,
        password: string,
        name: string,
        picture: string,
        method: AuthMethod,
        isVerified: boolean,
    ) {
        const user = await this.prismaService.user.create({
            data: {
                email,
                password: password ? await hash(password) : null,
                name,
                picture,
                method,
                isVerified,
            },
            include: {
                accounts: true,
            },
        });

        return user;
    }

    public async isUserByEmail(email: string){
        const user = await this.findByEmail(email)
        if(!user){
            throw new NotFoundException('Email is not found')
        }

        return !!user
    }

    public async verifyUser(userId: string) {
        return this.prismaService.user.update({
            where: { id: userId },
            data: {
                isVerified: true,
            },
        });
    }

    public async resetNewPassword(id: string, newPassword) {
        return this.prismaService.user.update({
            where: { id },
            data: {
                password: await hash(newPassword),
            },
        });
    }
}
