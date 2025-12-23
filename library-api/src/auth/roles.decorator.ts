// src/auth/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';

// @Roles('admin') diyebilmek için:
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);