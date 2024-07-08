import { Reflector } from '@nestjs/core';
import { Role } from 'src/interfaces/user.interface';

export const Roles = Reflector.createDecorator<Role[]>({});
