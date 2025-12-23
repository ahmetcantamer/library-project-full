// src/users/users.service.ts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  // 1. Yeni Kullanıcı Oluşturma (Register için)
  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepo.findOne({
      where: [{ username: createUserDto.username }, { email: createUserDto.email }],
    });

    if (existingUser) {
      throw new BadRequestException('Kullanıcı adı veya E-posta zaten kullanımda');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.userRepo.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.userRepo.save(user);
  }

  // 2. Auth için Kullanıcı Adı ile Bulma
  async findOneByUsername(username: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { username } });
  }

  // --- EKSİK OLAN METODLARI GERİ EKLEDİK ---

  // 3. Tüm Kullanıcıları Getir (Admin Paneli İçin)
  findAll() {
    return this.userRepo.find();
  }

  // 4. ID ile Tek Kullanıcı Getir
  async findOne(id: number) {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) throw new NotFoundException(`Kullanıcı ID ${id} bulunamadı`);
    return user;
  }

  // 5. Kullanıcı Güncelle
  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepo.update(id, updateUserDto);
  }

  // 6. Kullanıcı Sil
  remove(id: number) {
    return this.userRepo.delete(id);
  }
}