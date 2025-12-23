// src/auth/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Bu sayfa için hangi roller gerekli? (Örn: admin)
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    
    // Eğer rol şartı yoksa herkes girebilir
    if (!requiredRoles) {
      return true;
    }

    // 2. Giriş yapan kullanıcıyı al
    const { user } = context.switchToHttp().getRequest();
    
    // 3. Kullanıcının rolü izin verilenler arasında var mı?
    // user?.role -> Kullanıcı login olmuş mu ve rolü var mı?
    return requiredRoles.some((role) => user?.role?.includes(role));
  }
}