import { Injectable } from '@nestjs/common';
import { UserService } from '@/user/services/user.service';
import { AccountService } from '@/account/account.service';
import { AuthMethod } from '@prisma/client';
import { GoogleUser } from '../interfaces/google-user.interface';

@Injectable()
export class OAuthService {
    constructor(
        private readonly userService: UserService,
        private readonly accountService: AccountService,
    ) {}

    async validateGoogleUser(googleUser: GoogleUser) {
        const account = await this.accountService.findGoogleAccount(
            googleUser.providerId,
        );

        if (account) {
            return account.user;
        }

        let user = await this.userService.findByEmail(googleUser.email);

        if (!user) {
            user = await this.userService.create(
                googleUser.email,
                '',
                googleUser.name,
                googleUser.picture,
                AuthMethod.GOOGLE,
                true,
            );
        }

        await this.accountService.createGoogleAccount(
            user.id,
            googleUser.providerId,
            googleUser.accessToken,
            googleUser.refreshToken,
        );

        return user;
    }
}
