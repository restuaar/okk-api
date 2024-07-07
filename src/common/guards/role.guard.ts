import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role } from 'src/interfaces/auth.interface';
import { UserEntity } from 'src/users/entities/user.entity';
import { Roles } from '../decorators/roles.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<Role[]>(Roles, context.getHandler());
    if (!roles) {
      console.log('MASUK SINI YA');
      return true;
    }

    const user = context.switchToHttp().getRequest().user as UserEntity;
    const role = user.role;

    if (roles.includes(role)) {
      return true;
    }

    return false;
  }
}
