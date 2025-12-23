// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy'; // <-- 1. İMPORT ET

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: 'GIZLI_KELIME_BURAYA',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  // 2. PROVIDERS LİSTESİNE EKLE
  providers: [AuthService, JwtStrategy], 
})
export class AuthModule {}