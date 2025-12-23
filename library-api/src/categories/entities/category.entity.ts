// src/categories/entities/category.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Book } from '../../books/entities/book.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // Kategori adı (Örn: Bilim Kurgu)

  // İLİŞKİ: Bir kategori, BİRDEN ÇOK kitapta bulunabilir.
  @ManyToMany(() => Book, (book) => book.categories)
  books: Book[];
}
