import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';
import { Repository } from 'typeorm';
import { AddProductDto } from './dto';

@Injectable()
export class ProductService {
    constructor(@InjectRepository(Product) private productRepo:Repository<Product>){}
    async getProduct(){
        try{
            const product = await this.productRepo.find();
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
        console.log(userData.role)
        if(userData.role!=="ADMIN") throw new ForbiddenException("Only Admin can add Product")
            try{
                const res = await this.productRepo.save(dto)
                return res;
            }catch(error){
                throw error
            }
    }
        
    async updateProduct(){}
    
    async deleteProduct(){}
}
