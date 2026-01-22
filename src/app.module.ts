import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/db.config';
import { AuthModule } from './auth/auth.module';
import { ProductService } from './product/product.service';
import { ProductModule } from './product/product.module';
import { ProductController } from './product/product.controller';
import { OrderController } from './order/order.controller';
import { OrderModule } from './order/order.module';
import { OrderService } from './order/order.service';

@Module({
  imports: [ConfigModule.forRoot({isGlobal:true}),
  TypeOrmModule.forRoot(typeOrmConfig),
  AuthModule,
  ProductModule,
  OrderModule,],
  controllers: [],
  providers: [],
})
export class AppModule {}
