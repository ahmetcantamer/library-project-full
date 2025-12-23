// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthorsModule } from './authors/authors.module';
import { CategoriesModule } from './categories/categories.module';
import { BooksModule } from './books/books.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRoot({
      type: 'postgres', // <-- ARTIK POSTGRES
      url: 'postgresql://neondb_owner:npg_zGqPuFJx43UQ@ep-bold-dawn-a47yguk6-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require', // <-- ÖRN: postgres://neondb_...
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Tabloları otamatik oluşturur
      ssl: true, // <-- BULUT İÇİN BU ŞART
    }),

    UsersModule,
    AuthorsModule,
    CategoriesModule,
    BooksModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}