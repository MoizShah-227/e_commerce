import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { user } from 'srentities/cart.entity';
import { Repository } from 'typeorm';
import * as argon from 'argon2'
import { User } from 'src/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { loginDto, RegisterDto } from './dto';

@Injectable()
export class AuthService {
    constructor(
    private jwt:JwtService,
    private config: ConfigService,
    @InjectRepository(User)
    private userRepo: Repository<User>,) {}
    
    async register(dto:RegisterDto){
        const hash = await argon.hash(dto.password);
        try{   
            const res = await this.userRepo.save({
                name:dto.name,
                email:dto.email,
                Hash:hash,
            })                     
            return this.signToken(res.id,res.email);
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
            if(!pwmatch) throw new ForbiddenException("Invalid Password")
            
            return this.signToken(user.id,user.email);
        }catch(error){

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
}
