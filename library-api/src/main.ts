// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Bu satır, gelen verileri DTO kurallarına göre kontrol etmesini sağlar
  app.useGlobalPipes(new ValidationPipe());
  
  // CORS ayarı: Frontend (React) ile Backend konuşabilsin diye izin veriyoruz
  app.enableCors(); 
  
  await app.listen(3000);
}
bootstrap();