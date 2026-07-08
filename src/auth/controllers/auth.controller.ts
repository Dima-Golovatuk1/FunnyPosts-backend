import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Req,
    Res,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { RegisterDto } from '../dto/auth/register.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { LoginDto } from '../dto/auth/logim.dto';
import { Recaptcha } from '@nestlab/google-recaptcha';

@Controller('auth')
export class AuthController {
    public constructor(private readonly authService: AuthService) {}

    @ApiOperation({
        summary: 'create account',
        description: 'create new account',
    })
    @Recaptcha()
    @Post('registration')
    @HttpCode(HttpStatus.OK)
    public async register(@Req() req: Request, @Body() dto: RegisterDto) {
        return this.authService.register(req, dto);
    }

    @ApiOperation({
        summary: 'login account',
        description: 'login in account',
    })
    @Recaptcha()
    @Post('login')
    @HttpCode(HttpStatus.OK)
    public async login(@Req() req: Request, @Body() dto: LoginDto) {
        return this.authService.login(req, dto);
    }

    @ApiOperation({
        summary: 'logout account',
        description: 'logout in account',
    })
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    public async logout(@Req() req: Request, @Res() res: Response) {
        return this.authService.logout(req, res);
    }
}
