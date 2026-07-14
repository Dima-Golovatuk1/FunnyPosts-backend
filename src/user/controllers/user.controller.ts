import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { Authorization } from '@/auth/decorators/auth.decorator';
import { Authorized } from '@/auth/decorators/authorized.decorator';
import { ApiOperation } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @ApiOperation({
        summary: 'profile',
        description: 'show user information',
    })
    @Authorization()
    @HttpCode(HttpStatus.OK)
    @Get('profile')
    public async findProfile(@Authorized('id') userId: string) {
        return this.userService.findById(userId);
    }

    @ApiOperation({
        summary: 'find profile by id',
        description: 'find profile by id and show user information',
    })
    @Authorization(UserRole.ADMIN)
    @HttpCode(HttpStatus.OK)
    @Get('by-id/:id')
    public async findById(@Param('id') userId: string) {
        return this.userService.findById(userId);
    }
}
