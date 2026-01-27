import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query, UnsupportedMediaTypeException, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProductService } from './product.service';
import { JwtGuard } from 'src/auth/guard';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorator';
import { AddProductDto, EditProductDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Products')
@ApiBearerAuth()
@Controller('product')
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

    @UseGuards(JwtGuard)
    @Post("/admin/add-product")
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
            file: {
                type: 'string',
                format: 'binary',
            },
            data: {
                type: 'string',
                example: JSON.stringify({
                name: 'iPhone 15 Pro',
                description: 'Latest Apple flagship phone',
                price: 250000,
                stockQuantity: 12,
                category: 'Electronics',
                isActive: true,
                }),
            },
            },
        },
        })
    addProduct(@GetUser() userData: any , @Body('data') rawJson: string,@UploadedFile() file:Express.Multer.File){
            // console.log(typeof dto.price, dto.price);
            // console.log(typeof dto.stockQuantity, dto.stockQuantity);
              const dto: AddProductDto = JSON.parse(rawJson);
        return this.productService.addProduct(userData,dto,file)
    }
    
    @UseGuards(JwtGuard)
    @Patch("/admin/update-product/:id")
    updateProduct(@GetUser() userData:any,@Param('id',ParseIntPipe) productId:number,@Body() dto:EditProductDto){
        return this.productService.updateProduct(userData,productId,dto)

    }

    @UseGuards(JwtGuard)
    @Delete("/admin/delete-product/:id")
    deleteProduct(@GetUser() userData:any,@Param('id',ParseIntPipe) productId:number){
        return this.productService.deleteProduct(userData,productId)
    }

    @Get("/search-product/:name")
    searchProduct(@Param('name') name:string){
        return this.productService.searchProduct(name);
    }


    // @Post("/upload")
    // @UseInterceptors(FileInterceptor('file'))
    // @ApiConsumes('multipart/form-data')
    //     @ApiBody({
    //     description: 'Upload product image',
    //     required: true,
    //     schema: {
    //         type: 'object',
    //         properties: {
    //         file: {
    //             type: 'string',
    //             format: 'binary', // Important! Tells Swagger this is a file
    //         },
    //         },
    //     }},)
        
    // uploadImage(@UploadedFile() file:Express.Multer.File,){
    //     return this.productService.uploadImage(file);
    // }

}
