import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) {}

  async sendOtpEmail(email: string, name: string, otp: number) {
    return this.mailerService.sendMail({
      to:email,
      subject:"Your OTP Code",
      template:'otp',
      context:{
        name,
        otp,
      },
    });
  }

  async sendWelcomeEmail(email: string, name: string) {
    return this.mailerService.sendMail({
      to:email,
      subject:"Welcome",
      template:'welcome',
      context:{
        name,
      },
    });
  }
}
