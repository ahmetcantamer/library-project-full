// src/authors/entities/author.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Book } from '../../books/entities/book.entity'; // Kitap entity'sini çağırdık

@Entity('authors')
export class Author {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // Yazarın adı soyadı

  // İLİŞKİ: Bir yazarın, BİRDEN ÇOK kitabı olabilir.
  @OneToMany(() => Book, (book) => book.author)
  books: Book[];
}
