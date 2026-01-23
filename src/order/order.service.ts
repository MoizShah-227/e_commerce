import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { OrderStatus, OrderStatusDto, PlaceOrderDto } from './dto';
import { Product } from 'src/entities/product.entity';
import {  Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/entities/order.entity';
import { Cart, CartStatus } from 'src/entities/cart.entity';
import { ProductController } from 'src/product/product.controller';

@Injectable()
export class OrderService {
    constructor(@InjectRepository(Product) private productRepo:Repository<Product>,
        @InjectRepository(Order) private orderRepo:Repository<Order>,
        @InjectRepository(Cart) private cartRepo:Repository<Cart>){}
    
    async placeOrder(user:any){
        if(user.role!=="USER") throw new ForbiddenException("only User can place order") 
        const cart = await this.cartRepo.findOne({where:{user:{id:user.id},status:CartStatus.ACTIVE}})

        if(!cart) throw new NotFoundException("Cart not Found")
        type OrderItem = {
            product: Product;
            quantity: number;
        };

        const orderItems: OrderItem[] = [];
        
        for(const item of cart.items){
            const product = await this.productRepo.findOne({where:{ id: item?.ProductId,isActive:true}})

            if (product?.stockQuantity === undefined) {
                 throw new BadRequestException(`Product stock info is missing`);
            }
            
            if(item.quantity>product.stockQuantity){
                throw new ForbiddenException(`product has only ${product?.stockQuantity} in stocks`)
            }
             orderItems.push({ product, quantity: item.quantity });
            
            //reducing the stock and save this
            product.stockQuantity-=item.quantity
            await this.productRepo.save(product)            
        }

            //calulate the total
            const totalAmount = await this.calculateTotal(orderItems)
            console.log(totalAmount)

            //save data to the order
            const order = this.orderRepo.create({
                user:{id:user.id},
                items:orderItems,
                totalAmount:totalAmount
            })
            await this.orderRepo.save(order)

            //clear the cart and change the status 
            cart.items=[]
            cart.status=CartStatus.INACTIVE
            await this.cartRepo.save(cart)
    }
        
    async getAllOrders(userData:any){
        if(userData.role!=="ADMIN") throw new ForbiddenException("Only Admin can Get")
        try{
            const res = this.orderRepo.find({relations:["user","products"]})
            return res;
        }catch(error){
        throw error
    }
}
    
    async getOrderStatus(user:any,status:OrderStatus){
        if(user.role!=="USER") throw new ForbiddenException("Only USER can Get")
        try{
            const order = await this.orderRepo.find({ where: { user: { id: user.id },status:status}});
            if(!order) return {message:`There is no ${status} order`}
            return order;
        }catch(error){
            throw error;
        }
    }

    async updateOrderStatus(userData:any,orderId:number,dto:OrderStatusDto){
        if(userData.role!=="ADMIN") throw new ForbiddenException("Only Admin can Get")
        try{
                const res = await this.orderRepo.update({id:orderId},{status:dto.status})
                if(res.affected===0) throw new NotFoundException("Order not Found") 
                return res;
        }
        catch(error){
            throw error;
        }
    }

    calculateTotal(items: { product: any; quantity: number }[]) {
    const total = items.reduce((sum, item) => {
        return sum + Number(item.product.price) * item.quantity;
    }, 0);
    return total;
    }

}
