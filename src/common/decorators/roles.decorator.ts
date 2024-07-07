import { Reflector } from '@nestjs/core';
import { Role } from 'src/interfaces/auth.interface';

export const Roles = Reflector.createDecorator<Role[]>({});
