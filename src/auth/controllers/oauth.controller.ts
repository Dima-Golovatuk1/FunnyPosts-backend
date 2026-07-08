import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { Request, Response } from 'express';
import { GoogleAuthGuard } from '../guards/google-auth.guard';

@Controller('oauth')
export class OauthController {
    public constructor(private readonly authService: AuthService) {}

    @Get('google')
    @UseGuards(GoogleAuthGuard)
    public async googleAuth() {}

    @Get('google/callback')
    @UseGuards(GoogleAuthGuard)
    public async googleCallback(@Req() req: Request, @Res() res: Response) {
        console.log(req.user);

        return this.authService.googleLogin(req, res);
    }
}
