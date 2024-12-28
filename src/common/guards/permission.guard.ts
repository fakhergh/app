import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

import { UnauthorizedError } from '../../modules/auth/auth.error';
import { UserType } from '../../modules/common/types/user.type';
import { Permission } from '../../modules/permission/permission.schema';
import { Role, RoleType } from '../../modules/role/role.schema';
import { PERMISSIONS_KEY } from '../decorators/permission.decorator';

const errorMessage = 'You do not have permission to access this resource';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;

    const requiredPermissions = this.reflector.get<string[]>(PERMISSIONS_KEY, context.getHandler());

    if (!requiredPermissions) return true;

    // check permission only for ADMIN
    if (req.user.userType === UserType.ADMIN) {
      const roles = req.user.roles;

      const isSuperAdmin = roles.some((role: Role) => role.type === RoleType.SUPER_ADMIN);

      if (isSuperAdmin) return true;

      if (!roles?.length) throw new UnauthorizedError(errorMessage);

      const userPermissions = roles.flatMap(({ permissions }: { permissions: Permission }) => permissions);

      const hasPermission = userPermissions.some((permission: Permission) =>
        requiredPermissions.includes(`${permission.type}:${permission.action}`),
      );

      if (!hasPermission) throw new UnauthorizedError(errorMessage);
    }

    return true;
  }
}
