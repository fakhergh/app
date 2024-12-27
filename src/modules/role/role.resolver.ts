import { Args, Mutation, Query, ResolveField, Resolver, Root } from '@nestjs/graphql';

import { HasPermission } from '@/common/decorators/permission.decorator';
import { NodeResolver } from '@/modules/common/resolvers/node.resolver';
import { PERMISSIONS } from '@/modules/common/types/permission.type';
import { PaginationArgs } from '@/modules/common/types/query.type';
import { Permission } from '@/modules/permission/permission.schema';
import { PermissionService } from '@/modules/permission/permission.service';
import { RoleDuplicationError, RoleNotFoundError } from '@/modules/role/role.error';
import { Role, RoleDocument } from '@/modules/role/role.schema';
import { RoleService } from '@/modules/role/role.service';
import {
  CreateRoleInput,
  DeleteRoleInput,
  DisableRoleInput,
  EnableRoleInput,
  RolePagination,
  RolePaginationInput,
  UpdateRoleInput,
} from '@/modules/role/role.type';

@Resolver(() => Role)
export class RoleResolver extends NodeResolver<Role> {
  constructor(
    private readonly roleService: RoleService,
    private readonly permissionService: PermissionService,
  ) {
    super();
  }

  @HasPermission(PERMISSIONS.ROLE.READ)
  @Query(() => RolePagination)
  rolesPagination(
    @Args() paginationArgs: PaginationArgs,
    @Args('input', { nullable: true }) input: RolePaginationInput = {},
  ) {
    return this.roleService.getRolesPagination(paginationArgs, input);
  }

  @HasPermission(PERMISSIONS.ROLE.CREATE)
  @Mutation(() => Role)
  async createRole(@Args('input') input: CreateRoleInput) {
    const roleExists = await this.roleService.checkRoleExistenceByName(input.name);

    if (roleExists) throw new RoleDuplicationError('Role already exists');

    return this.roleService.createRole(input);
  }

  @HasPermission(PERMISSIONS.ROLE.UPDATE)
  @Mutation(() => Role)
  async updateRole(@Args('input') input: UpdateRoleInput) {
    const role = await this.roleService.updateRole(input);

    if (!role) throw new RoleNotFoundError('Role not found');

    return role;
  }

  @HasPermission(PERMISSIONS.ROLE.DELETE)
  @Mutation(() => Role)
  async deleteRole(@Args('input') input: DeleteRoleInput) {
    const role = await this.roleService.deleteRole(input.id);

    if (!role) throw new RoleNotFoundError('Role not found');

    return role;
  }

  @HasPermission(PERMISSIONS.ROLE.UPDATE)
  @Mutation(() => Role)
  async enableRole(@Args('input') input: EnableRoleInput) {
    const role = await this.roleService.enableRole(input.id);

    if (!role) throw new RoleNotFoundError('Role not found');

    return role;
  }

  @HasPermission(PERMISSIONS.ROLE.UPDATE)
  @Mutation(() => Role)
  async disableRole(@Args('input') input: DisableRoleInput) {
    const role = await this.roleService.disableRole(input.id);

    if (!role) throw new RoleNotFoundError('Role not found');

    return role;
  }

  @ResolveField(() => [Permission])
  permissions(@Root() role: RoleDocument) {
    return this.permissionService.getPermissionsByIds(role.permissions);
  }
}
