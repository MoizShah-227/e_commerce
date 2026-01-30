import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  const configService = app.get(ConfigService);
  const swaggerConfig = new DocumentBuilder()
    .setTitle("E_Commerce")
    .setDescription("API Testing")
    .addBearerAuth()
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  // ⚡ Mount Swagger at /api-docs instead of root
  SwaggerModule.setup("api-docs", app, document);

  const port = configService.get<number>("PORT") || 3000;
  await app.listen(port);

  console.log(`🚀 Server running on http://localhost:${port}`);
}
bootstrap();
