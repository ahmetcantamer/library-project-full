// src/books/dto/create-book.dto.ts
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  authorId: number; // Seçilen yazarın ID'si (Tekil)

  @IsArray() // Birden fazla kategori olabilir
  @IsNumber({}, { each: true }) // Dizinin içindekilerin hepsi sayı olmalı
  categoryIds: number[]; // Seçilen kategorilerin ID'leri (Çoğul: [1, 3, 5])
}
