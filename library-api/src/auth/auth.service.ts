// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // 1. LOGIN İŞLEMİ
  async login(loginDto: LoginDto) {
    // A. Kullanıcıyı bul
    const user = await this.usersService.findOneByUsername(loginDto.username);
    
    // B. Kullanıcı yoksa veya şifre yanlışsa hata ver
    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Kullanıcı adı veya şifre hatalı');
    }

    // C. Her şey doğruysa Token oluştur
    const payload = { sub: user.id, username: user.username, role: user.role };
    
    return {
      access_token: this.jwtService.sign(payload), // Token'ı üret ve gönder
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    };
  }

  // 2. REGISTER İŞLEMİ (Direkt usersService'i kullanır)
  async register(registerDto: any) {
    return this.usersService.create(registerDto);
  }
}