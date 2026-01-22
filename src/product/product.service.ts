import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';
import { Repository } from 'typeorm';
import { AddProductDto, EditProductDto } from './dto';
import { error } from 'console';

@Injectable()
export class ProductService {
    constructor(@InjectRepository(Product) private productRepo:Repository<Product>){}
    async getProduct(){
        try{
            const product = await this.productRepo.find({where:{isActive:true}});
            if(!product) throw new ForbiddenException("There no product")
            return product;
        }catch(error){
            throw new ForbiddenException(error)
        }
    }
    
    async getProductById(productId:number){
        try{
            const product = await this.productRepo.findOneBy({id:productId});
            if(!product) throw new ForbiddenException("No product found")
            return product;
        }catch(error){
            throw new ForbiddenException(error)
        }
    }

    async addProduct(userData:any,dto:AddProductDto){
        if(userData.role!=="ADMIN") throw new ForbiddenException("Only Admin can add Product")
            try{
                const res = await this.productRepo.save(dto)
                return res;
            }catch(error){
                throw error
            }
    }
        
    async updateProduct(userData:any ,productId: number,dto:EditProductDto){
        if(userData.role!=="ADMIN") throw new ForbiddenException("Only Admin can edit Product")
        try{
            const res = await this.productRepo.update({id:productId},dto);
            if (res.affected===0) {
                    throw new NotFoundException(`Product not found`);
            }
            return res
        }
            catch(error){
                throw error;
        }
    }

    
    async deleteProduct(userData:any,productId:number){
        
        if(userData.role!=="ADMIN") throw new ForbiddenException("only admin can Delete product")
        const product = await this.productRepo.findOneBy({id:productId})
        if(!product) throw new NotFoundException("Product not found")
        try{
            if(product){
                const res = await this.productRepo.update({id:productId},{isActive:!product.isActive})
                return res;
            }
        }catch(error){
            throw new error
        }

    }
}
