import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { OrderStatusDto, PlaceOrderDto } from './dto';
import { Product } from 'src/entities/product.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/entities/order.entity';
import { promises } from 'dns';
import { retryWhen } from 'rxjs';

@Injectable()
export class OrderService {
    constructor(@InjectRepository(Product) private productRepo:Repository<Product>,
        @InjectRepository(Order) private orderRepo:Repository<Order>){}
    
    async placeOrder(user:any,dto:PlaceOrderDto){
        console.log("user",user)
        console.log("dto",dto)
        if(user.role!=="USER") throw new ForbiddenException("only User can place order") 
        
        const products = await this.productRepo.find({where:{id:In(dto.products)}})
        const totalAmount=await this.calulateTotal(products)
        try{
              const order = this.orderRepo.create({
                user: { id: user.id },      
                products: products,      
                totalAmount,
            });
            const res = await this.orderRepo.save(order)
            return res;
        }catch(error){
            throw error;
        }
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
    
    async getOrderHistory(){
        return "placeorder2"
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

    calulateTotal(products:any){
        const total = products.reduce((sum, product:any) => sum + parseInt(product.price), 0);
        return total;
    }
}
