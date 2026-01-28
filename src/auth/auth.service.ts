import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { user } from 'srentities/cart.entity';
import { Repository } from 'typeorm';
import * as argon from 'argon2'
import { User } from 'src/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { loginDto, RegisterDto, VerifyOtpDto } from './dto';
import { MailService } from 'src/mail/mail.service';
import { Otp } from 'src/entities/otp.entity';

@Injectable()
export class AuthService {
    constructor(
    private jwt:JwtService,
    private config: ConfigService,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Otp)
    private otpRepo: Repository<Otp>,
    private readonly mailService: MailService,) {}
    
    async register(dto:RegisterDto){
        const hash = await argon.hash(dto.password);
        const otpCode = this.createOtpCode()
        this.mailService.sendOtpEmail(dto.email,dto.name,otpCode)
        try{   
            const res = await this.userRepo.save({
                name:dto.name,
                email:dto.email,
                Hash:hash,
            })
            
            const saveOtp =await this.otpRepo.save({
                otp:otpCode,
                user:{id:res.id}
            })
            return  {
                email: res.email,
                userId: res.id
            }
            // return this.signToken(res.id,res.email);
        }catch(error){
            if(error.code === "23505"){
                throw new ForbiddenException("Credentials taken")
            }
        }
    }

    async login(dto:loginDto){
        try{

            const user= await this.userRepo.findOneBy({email:dto.email})
            if(!user) throw new ForbiddenException("Invalid Credentials")
            const pwmatch = await argon.verify(user.Hash,dto.password)
            if(!pwmatch) throw new ForbiddenException("Invalid Password");
            
            if(!user.status) throw new ForbiddenException("Please verify your Account");
            return this.signToken(user.id,user.email);
        }catch(error){
            throw error;
        }
    }


     async signToken(userId:number,email:string):Promise<{access_token:string}>{
        const payload ={
            sub:userId,
            email
        }
        const secret =this.config.get('JWT_KEY')
        const token =  await this.jwt.signAsync(payload,{
            expiresIn:'1h',
            secret:secret,
        });

        return {access_token:"Bearer "+token,}

    }

        async verifyOTP(dto: VerifyOtpDto) {
            try {
                const user = await this.userRepo.findOne({
                    where: { id: dto.userId },
                    relations: ['otp'],
                });

                if (!user) {
                    throw new NotFoundException('User not found');
                }

                if (user.status) {
                    throw new BadRequestException('Email already verified');
                }

                if (!user.otp) {
                    throw new BadRequestException('No OTP found. Please request a new one.');
                }

                if (user.otp.otp !== dto.otp) {
                    throw new BadRequestException('Invalid OTP');
                }

                const otpAge = Date.now() - user.otp.createdAt.getTime();
                const fiveMinutes = 5 * 60 * 1000;
                
                if (otpAge > fiveMinutes) {
                    throw new BadRequestException('OTP has expired. Please request a new one.');
                }

                user.status = true;
                await this.userRepo.save(user);

                await this.otpRepo.remove(user.otp);

                return {
                    message: 'Email verified successfully',
                    token: await this.signToken(user.id, user.email), // If you want auto-login
                    user: {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                    },
                };

            } catch (error) {
                throw error;
            }
        }

    async email(){
        await this.mailService.sendOtpEmail("glidexsol@gmail.com","testing",123667)
    }

    createOtpCode(){
      return Math.floor(100000 + Math.random() * 900000);
    }
}
