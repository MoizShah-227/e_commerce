import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { user } from 'src/entities/user.enitity';
import { Repository } from 'typeorm';
import * as argon from 'argon2'

@Injectable()
export class AuthService {
    constructor(
    @InjectRepository(user)
    private readonly userRepo: Repository<user>,
  ) {}
    async register(dto){
        const hash = await argon.hash(dto.password);
        console.log(hash);
        try{            
            const res = await this.userRepo.create({
                name:dto.name,
                email:dto.email,
                password:hash,
            })
            return res;
        }catch(error){
            throw new ForbiddenException(error)
        }
    }

    async login(dto){
        try{
            const user = this.userRepo.findOneBy({email:dto.email})
            if(!user) throw new ForbiddenException("Invalid Credentials")
            
            const pwmatch = await argon.verify(user.password,dto.password)
        }
    }
}
