import { Reflector } from '@nestjs/core';
import { Role } from 'src/interfaces/users.interface';

export const Roles = Reflector.createDecorator<Role[]>({});
