import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard';
import { CartService } from './cart.service';
import { GetUser } from 'src/auth/decorator';
import { AddToCartDto } from './dto';

@Controller('cart')
@ApiTags('Cart')
@ApiBearerAuth()
@UseGuards(JwtGuard)
export class CartController {
    constructor(private readonly cartService: CartService){}
     @Post('/addToCart')
        addToCart(@GetUser() user:any,@Body() dto:AddToCartDto){
            console.log("User",user)
            return this.cartService.addToCart(user,dto)
        }
}
