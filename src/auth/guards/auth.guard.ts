import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserService } from '@/user/services/user.service';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
    public constructor(private readonly userService: UserService) {}

    public async canActivate(context: ExecutionContext): Promise<boolean> {

        const request = context.switchToHttp().getRequest();

        if(typeof request.session.userId === 'undefined'){
            throw new UnauthorizedException(
                'User do not authorization'
            )
        }

        const user = await this.userService.findById(request.session.userId)

        request.user = user

        return true
    }
}
