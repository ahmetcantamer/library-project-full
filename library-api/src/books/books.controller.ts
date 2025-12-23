// src/books/books.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard'; // Yoluna dikkat et
import { Roles } from '../auth/roles.decorator'; // Yoluna dikkat et

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  // 1. KİTAP EKLEME (Sadece Admin)
  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard) // Önce Token var mı, Sonra Rol yetiyor mu?
  @Roles('admin') // Sadece 'admin' rolü girebilir
  create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  // 2. LİSTELEME (Herkes Görebilir - Koruma Yok)
  @Get()
  findAll() {
    return this.booksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(+id);
  }

  // 3. GÜNCELLEME (Sadece Admin)
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update(+id, updateBookDto);
  }

  // 4. SİLME (Sadece Admin)
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.booksService.remove(+id);
  }
}