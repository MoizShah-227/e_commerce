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
    addProduct(@GetUser() userData: any ,@Body() dto:AddProductDto){
        return this.productService.addProduct(userData,dto)
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


    @Post("/upload")
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
        @ApiBody({
        description: 'Upload product image',
        required: true,
        schema: {
            type: 'object',
            properties: {
            file: {
                type: 'string',
                format: 'binary', // Important! Tells Swagger this is a file
            },
            },
        }},)
        
    uploadImage(@UploadedFile() file:Express.Multer.File,){
        // const imageUrl = file.path; // <-- this is the Cloudinary URL
        return this.productService.uploadImage(file);
    }

}
