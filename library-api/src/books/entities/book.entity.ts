// src/books/entities/book.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Author } from '../../authors/entities/author.entity';
import { Category } from '../../categories/entities/category.entity';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string; // Kitap Adı

  @Column({ nullable: true })
  description: string; // Açıklama (Boş bırakılabilir)

  // İLİŞKİ 1: Bir kitabın TEK BİR yazarı olur (Basitleştirmek için böyle yapıyoruz)
  @ManyToOne(() => Author, (author) => author.books, { onDelete: 'SET NULL' })
  author: Author;

  // İLİŞKİ 2: Bir kitabın BİRDEN ÇOK kategorisi olabilir
  @ManyToMany(() => Category, (category) => category.books)
  @JoinTable() // Çoka-Çok ilişkilerde, ara tabloyu oluşturmak için bu komut şarttır!
  categories: Category[];
}