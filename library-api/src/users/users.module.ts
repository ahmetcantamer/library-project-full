// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm'; // <-- Bu eksikti
import { User } from './entities/user.entity';     // <-- Bu eksikti

@Module({
  imports: [
    // Veritabanı tablosunu bu modüle tanıtıyoruz:
    TypeOrmModule.forFeature([User]), 
  ],
  controllers: [UsersController],
  providers: [UsersService],
  // Auth modülü UsersService'i kullanabilsin diye dışarıya açıyoruz:
  exports: [UsersService], 
})
export class UsersModule {}