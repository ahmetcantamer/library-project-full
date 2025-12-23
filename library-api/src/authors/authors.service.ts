// src/authors/authors.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { Author } from './entities/author.entity';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Author)
    private authorRepo: Repository<Author>,
  ) {}

  create(createAuthorDto: CreateAuthorDto) {
    const author = this.authorRepo.create(createAuthorDto);
    return this.authorRepo.save(author);
  }

  findAll() {
    return this.authorRepo.find();
  }

  findOne(id: number) {
    return this.authorRepo.findOneBy({ id });
  }

  async remove(id: number) {
    const result = await this.authorRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Yazar ID ${id} bulunamadı`);
    }
    return { deleted: true };
  }
  
  // Update kısmı şimdilik boş kalsın, gerekirse ekleriz.
  update(id: number, updateAuthorDto: UpdateAuthorDto) {
    return `This action updates a #${id} author`;
  }
}
