import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { GetUser } from 'src/auth/decorator';
import { OrderStatus, OrderStatusDto, PlaceOrderDto } from './dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard';

@Controller('order')
@ApiTags('Order')

@ApiBearerAuth()
@Controller('product')
@UseGuards(JwtGuard)

export class OrderController {

    constructor(private readonly orderService: OrderService){}
    @Post('/place-order')
    placeOrder(@GetUser() user:any,@Body() dto:PlaceOrderDto){
        return this.orderService.placeOrder(user,dto)
    }
    
    @Get('/getAllOrders')
    getAllOrders(@GetUser() userData:any){
        return this.orderService.getAllOrders(userData)
    }

    @Get('/order-history')
    getOrderHistory(){
        return this.orderService.getOrderHistory()

    }

    @Patch('/update-order-status/:id')
    updateOrderStatus(@GetUser() userData:any,@Param('id',ParseIntPipe) orderId:number,@Body() dto:OrderStatusDto){
        return this.orderService.updateOrderStatus(userData,orderId,dto)

    }

}
