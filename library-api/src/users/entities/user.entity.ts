// src/users/entities/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users') // Veritabanındaki tablo adı 'users' olacak
export class User {
  @PrimaryGeneratedColumn()
  id: number; // Otomatik artan ID (1, 2, 3...)

  @Column({ unique: true })
  username: string; // Kullanıcı adı (Benzersiz olmalı)

  @Column({ unique: true })
  email: string; // E-posta (Benzersiz olmalı)

  @Column()
  password: string; // Şifre

  @Column({ default: 'admin' }) 
  role: string; // Rolü: Varsayılan olarak 'user' olsun. Admin için elle değiştireceğiz.
}
