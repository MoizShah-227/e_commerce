import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart, CartStatus } from 'src/entities/cart.entity';
import { Product } from 'src/entities/product.entity';
import { Repository } from 'typeorm';
import { AddToCartDto, RemoveFromCartDto } from './dto';
import { QueueAction } from 'rxjs/internal/scheduler/QueueAction';

@Injectable()
export class CartService {
    constructor(@InjectRepository(Product) private productRepo:Repository<Product>,
        @InjectRepository(Cart) private cartRepo:Repository<Cart>){}
        
        async addToCart(user:any,dto:AddToCartDto){
        if(user.role!=="USER") throw new ForbiddenException("only User can AddToCart") 
            
          try{
            const {ProductId,quantity} =dto;
            if(dto.quantity<=0) throw new ForbiddenException("Quantity must be greater than 0")
            
            const product = await this.productRepo.findOneBy({id:ProductId})
            if(!product) throw new NotFoundException("Product Not Found")

            let cart = await this.cartRepo.findOne({where:{user:{id:user.id},status:CartStatus.ACTIVE}})
            if(quantity>product.stockQuantity) throw new ForbiddenException("Item is out of stock")
            if(!cart){
                cart= this.cartRepo.create({
                    user:{id:user.id},
                    items:[],
                    status:CartStatus.ACTIVE
                });
            }

            const checkItem = cart.items.find((item)=>item.ProductId===ProductId)
            if(checkItem){
                if(quantity>checkItem.quantity){
                    checkItem.quantity=checkItem.quantity+quantity
                }else{
                    checkItem.quantity=checkItem.quantity-quantity
                }
            }else{
                cart.items.push({ProductId,quantity})
            }
            const res =await this.cartRepo.save(cart)
            return res
          }
        catch(error){
            throw error
        }
    }


    async RemoveFromCart(user:any,dto:RemoveFromCartDto){
        if(user.role!=="USER") throw new ForbiddenException("Only User Can Remove Form Cart")
        
        try{
            const cart = await this.cartRepo.findOne({where:{user:{id:user.id},status:CartStatus.ACTIVE}})
            if(!cart) throw new NotFoundException("Cart not Found")

            const filtercart = cart?.items.filter((item)=>item.ProductId!==dto.ProductId)
            if(filtercart.length===0){
                cart.status=CartStatus.INACTIVE
            }
            cart.items=filtercart
            await this.cartRepo.save(cart)
            return {message:"Item Remove from cart"}
        }catch(error){
            throw error;
        }
        
    }
}
