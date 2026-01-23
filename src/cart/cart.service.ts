import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart, CartStatus } from 'src/entities/cart.entity';
import { Product } from 'src/entities/product.entity';
import { Repository } from 'typeorm';
import { AddToCartDto } from './dto';
import { QueueAction } from 'rxjs/internal/scheduler/QueueAction';

@Injectable()
export class CartService {
    constructor(@InjectRepository(Product) private productRepo:Repository<Product>,
        @InjectRepository(Cart) private cartRepo:Repository<Cart>){}
        
        async addToCart(user:any,dto:AddToCartDto){
          try{
            const {ProductId,quantity} =dto;
            if(dto.quantity<=0) throw new ForbiddenException("Quantity must be greater than 0")
            
            const product = await this.productRepo.findOneBy({id:ProductId})
            if(!product) throw new NotFoundException("Product Not Found")

            let cart = await this.cartRepo.findOne({where:{user:user.id,status:CartStatus.ACTIVE}})

            if(quantity>product.stockQuantity) throw new ForbiddenException("Item is out of stock")
            if(!cart){
                cart= this.cartRepo.create({
                    user:{id:user.id},
                    items:[],
                    status:CartStatus.ACTIVE
                });
            }

            const checkItem = cart.items.find((item)=>{item.ProductId===ProductId})
            if(checkItem){
                checkItem.quantity=checkItem.quantity+quantity
            }else{
                cart.items.push({ProductId,quantity})
            }
            const res =await this.cartRepo.save(cart)
            return res
          }
        catch(error){
            throw new error
        }
    }
}
