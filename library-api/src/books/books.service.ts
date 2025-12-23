// src/books/books.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';
import { Author } from '../authors/entities/author.entity';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private bookRepo: Repository<Book>,
    
    @InjectRepository(Author)
    private authorRepo: Repository<Author>,

    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
  ) {}

  async create(createBookDto: CreateBookDto) {
    // 1. Yazarı bul
    const author = await this.authorRepo.findOneBy({ id: createBookDto.authorId });
    if (!author) throw new NotFoundException('Yazar bulunamadı');

    // 2. Kategorileri bul (Örn: ID'si 1 ve 3 olanları getir)
    // 'In' komutu: "Şu listedeki ID'lere sahip olanları bul" demektir.
    const categories = await this.categoryRepo.findBy({
      id: In(createBookDto.categoryIds),
    });

    // 3. Kitabı oluştur ve ilişkileri bağla
    const book = this.bookRepo.create({
      title: createBookDto.title,
      description: createBookDto.description,
      author: author,        // İlişki kuruldu
      categories: categories, // İlişki kuruldu
    });

    return this.bookRepo.save(book);
  }

  findAll() {
    // Kitapları çekerken yazarını ve kategorilerini de getir (Join)
    return this.bookRepo.find({
      relations: ['author', 'categories'],
    });
  }

  findOne(id: number) {
    return this.bookRepo.findOne({
      where: { id },
      relations: ['author', 'categories'],
    });
  }

  async remove(id: number) {
    const result = await this.bookRepo.delete(id);
    if(result.affected === 0) throw new NotFoundException('Kitap bulunamadı');
    return { deleted: true };
  }

  update(id: number, updateBookDto: UpdateBookDto) {
    return `This action updates a #${id} book`;
  }
}