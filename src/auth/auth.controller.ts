import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginDto, RegisterDto } from './dto';


@Controller('auth')
export class AuthController {
    constructor(private authservice:AuthService){}
    @Post("/register")
    register(@Body() dto:RegisterDto){
        return this.authservice.register(dto)
    }

    @Post("/login")
    login(@Body() dto:loginDto){
        return this.authservice.login(dto)
    }

    @Post("/check-email")
    email(){
        return this.authservice.email()
    }
}
