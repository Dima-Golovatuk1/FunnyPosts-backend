import { Body, Controller, Post } from '@nestjs/common';
import { ResetPasswordService } from '../services/reset-password.service';
import { ApiOperation } from '@nestjs/swagger';
import { ResetPasswordSendDto } from '../dto/reset-password/reset-password-send.dto';
import { VerifyResetPasswordDto } from '../dto/reset-password/verify-reset-password-code.dto';
import { ResetPasswordDto } from '../dto/reset-password/reset-password.dto';

@Controller('reset-password')
export class ResetPasswordController {
    public constructor(
        private readonly resetPasswordService: ResetPasswordService,
    ) {}

    @ApiOperation({})
    @Post('send-code')
    public async sendResetPassword(@Body() dto: ResetPasswordSendDto) {
        return await this.resetPasswordService.sendCode(dto);
    }

    @ApiOperation({})
    @Post('verify-code')
    public async verifyResetPassword(@Body() dto: VerifyResetPasswordDto) {
        return await this.resetPasswordService.verifyCode(dto);
    }

    @ApiOperation({})
    @Post('reset')
    public async resetPassword(@Body() dto: ResetPasswordDto) {
        return await this.resetPasswordService.resetPassword(dto);
    }

    @ApiOperation({})
    @Post('resend-code')
    public async resendPassword(@Body() dto: ResetPasswordSendDto) {
        return await this.resetPasswordService.resendCode(dto);
    }
}
