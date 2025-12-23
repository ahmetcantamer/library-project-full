// src/auth/jwt.strategy.ts
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Token'ı nereden okuyayım? -> Header'daki 'Authorization: Bearer ...' kısmından
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // Süresi dolmuş tokenları kabul etme
      // DİKKAT: AuthModule.ts dosyasındaki 'secret' ile AYNISI olmalı!
      secretOrKey: 'GIZLI_KELIME_BURAYA', 
    });
  }

  // Token geçerliyse bu fonksiyon çalışır ve sonucu request.user içine atar
  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username, role: payload.role };
  }
}