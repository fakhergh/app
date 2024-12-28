import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

import { UnauthorizedError } from '../../modules/auth/auth.error';
import { HAS_ROLE_KEY } from '../decorators/has-role.decorator';

const errorMessage = 'You do not have permission to access this resource';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;

    const requiredRoles = this.reflector.get<string[]>(HAS_ROLE_KEY, context.getHandler());

    if (!requiredRoles) return true;

    const hasRole = requiredRoles.includes(req.user.userType);

    if (!hasRole) throw new UnauthorizedError(errorMessage);

    return true;
  }
}
