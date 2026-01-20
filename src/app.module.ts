import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/db.config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot({isGlobal:true}),
  TypeOrmModule.forRoot(typeOrmConfig),
  AuthModule],
    controllers: [],
  providers: [],
})
export class AppModule {}
