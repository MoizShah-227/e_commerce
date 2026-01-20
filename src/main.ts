import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const config=  new DocumentBuilder().setTitle("E_Commerce").setDescription("API Testing").setVersion('1.0').build()
  
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const docoment = SwaggerModule.createDocument(app,config);
  SwaggerModule.setup("",app,docoment);
  const port=configService.get<number>('PORT')||3000

  await app.listen(port);
}
bootstrap();
