// src/books/books.module.ts
import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Author } from '../authors/entities/author.entity'; // İMPORT
import { Category } from '../categories/entities/category.entity'; // İMPORT

@Module({
  imports: [
    // Kitap servisinde yazar ve kategori tablosunu kullandığımız için buraya ekliyoruz
    TypeOrmModule.forFeature([Book, Author, Category]), 
  ],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}