import { ConsoleLogger, Injectable } from '@nestjs/common';
import {ConfigService } from '@nestjs/config';
import { VerifyCaptchaDto } from 'src/auth/dto';

@Injectable()
export class CaptchaService {
    constructor(private config:ConfigService){}

    async verifyCaptcha(){
    // const secret =this.config.get("SECRET_KEY")
    // console.log("secret",secret)
    // console.log("token",dto.token)
    // const token =dto.token;
    // const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`;
    // const response = await fetch(url, { method: 'POST' });
    // const data = await response.json();
    // console.log("data",data)
    // if(data.success && data.score>0.5){
    //     return {message:"Human"}
    // }else{
    //     return {message:"Bot"}
    // }
    return {message:"heelo this is moiz"}
    }
}
