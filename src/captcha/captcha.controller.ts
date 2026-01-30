import { Body, Controller, Post } from '@nestjs/common';
import { CaptchaService } from './captcha.service';
import { VerifyCaptchaDto } from 'src/auth/dto';
import { dot } from 'node:test/reporters';

@Controller('captcha')
export class CaptchaController {
    constructor(private captchaService:CaptchaService){}
    @Post("verify-captcha")
    verifyCaptcha(){
        return this.captchaService.verifyCaptcha()
    }
}
