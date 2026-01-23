import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, UnsupportedMediaTypeException, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { JwtGuard } from 'src/auth/guard';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorator';
import { AddProductDto, EditProductDto } from './dto';

@ApiTags('Products')
@ApiBearerAuth()
@Controller('product')

@UseGuards(JwtGuard)
export class ProductController {
    constructor(private productService:ProductService){}

    @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
    @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
    
    @Get("/get-products")
    getProduct( @Query('page') page,@Query('limit') limit){
    return this.productService.getProduct(Number(page), Number(limit));
    }
    
    @Get("/get-product/:id")
    // @ApiParam({ name: 'id', type: Number })
    getProductById(@Param('id',ParseIntPipe) productId:number){
        return this.productService.getProductById(productId)
    }

    @Post("/add-product")
    addProduct(@GetUser() userData: any ,@Body() dto:AddProductDto){
        return this.productService.addProduct(userData,dto)
    }
    
    @Patch("/update-product/:id")
    updateProduct(@GetUser() userData:any,@Param('id',ParseIntPipe) productId:number,@Body() dto:EditProductDto){
        return this.productService.updateProduct(userData,productId,dto)

    }

    @Patch("/delete-product/:id")
    deleteProduct(@GetUser() userData:any,@Param('id',ParseIntPipe) productId:number){
        return this.productService.deleteProduct(userData,productId)
    }

    @Get("/search-product/:name")
    
    searchProduct(@Param('name') name:string){
        return this.productService.searchProduct(name);
    }

}
