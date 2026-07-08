import { Body, Controller, Get, Post, Req } from "@nestjs/common";
import { TwoFactorService } from "../services/two-factor.service";
import { VerifyTwoFactorDto } from "../dto/two-factor-service/verify-two-factor.dto";
import { Request } from "express";

@Controller('two-factor')
export class TwoFactorController {
    public constructor(
        private readonly twoFactorService: TwoFactorService
    ) {}

    @Post('verify-code')
    public async sendCode(@Body() dto: VerifyTwoFactorDto, @Req() req: Request){
        return await this.twoFactorService.verifyCode(dto, req)
    }


}
