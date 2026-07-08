import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import { SendVerifyEmail } from '../dto/verify-email/send-verify-email.dto';
import { VerificationService } from '../services/verification.service';

@Controller('verification')
export class VerificationController {
    public constructor(
        private readonly verificationService: VerificationService,
    ) {}

    @ApiOperation({})
    @Post('resend-code')
    public async resendToken(@Body() dto: SendVerifyEmail) {
        return this.verificationService.resendVerification(dto.email);
    }

    @ApiOperation({})
    @Get('verify')
    public async Token(
        @Query('token') token: string,
        @Query('email') email: string,
        @Res() res: Response,
    ) {
        return this.verificationService.verifyEmail(token, email, res);
    }
}
