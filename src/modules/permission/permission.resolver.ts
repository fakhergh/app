import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { HasPermission } from '../../common/decorators/permission.decorator';
import { NodeResolver } from '../common/resolvers/node.resolver';
import { PERMISSIONS } from '../common/types/permission.type';
import { PaginationArgs } from '../common/types/query.type';
import { PermissionDuplicationError, PermissionNotFoundError } from './permission.error';
import { Permission, PermissionAction, PermissionType } from './permission.schema';
import { PermissionService } from './permission.service';
import {
  CreatePermissionInput,
  DeletePermissionInput,
  DisablePermissionInput,
  EnablePermissionInput,
  PermissionPagination,
  PermissionPaginationInput,
  UpdatePermissionInput,
} from './permission.type';

@Resolver(() => Permission)
export class PermissionResolver extends NodeResolver<Permission> {
  constructor(private readonly permissionService: PermissionService) {
    super();
  }

  @HasPermission(PERMISSIONS.PERMISSION.READ)
  @Query(() => PermissionPagination)
  async permissionsPagination(
    @Args() paginationArgs: PaginationArgs,
    @Args('input', { nullable: true }) input: PermissionPaginationInput = {},
  ) {
    return this.permissionService.getPermissionsPagination(paginationArgs, input);
  }

  @HasPermission(PERMISSIONS.PERMISSION.READ)
  @Query(() => [PermissionType])
  permissionTypes() {
    return Object.values(PermissionType);
  }

  @HasPermission(PERMISSIONS.PERMISSION.CREATE)
  @Mutation(() => Permission)
  async createPermission(@Args('input') input: CreatePermissionInput) {
    const permissionExists = await this.permissionService.checkPermissionExistenceByActionAndType(
      input.action as PermissionAction,
      input.type as PermissionType,
    );

    if (permissionExists) throw new PermissionDuplicationError('permission already exists');

    return this.permissionService.createPermission(input);
  }

  @HasPermission(PERMISSIONS.PERMISSION.UPDATE)
  @Mutation(() => Permission)
  async updatePermission(@Args('input') input: UpdatePermissionInput) {
    const permissionByIdExists = await this.permissionService.checkPermissionExistenceById(input.id);

    if (!permissionByIdExists) throw new PermissionNotFoundError('permission not found');

    const permissionByActionAndTypeExists = await this.permissionService.checkPermissionExistenceByActionAndType(
      input.action,
      input.type,
    );

    if (permissionByActionAndTypeExists && permissionByActionAndTypeExists._id.toString() !== input.id)
      throw new PermissionDuplicationError('Permission already exists');

    return this.permissionService.updatePermission(input);
  }

  @HasPermission(PERMISSIONS.PERMISSION.DELETE)
  @Mutation(() => Permission)
  async deletePermission(@Args('input') input: DeletePermissionInput) {
    const permission = await this.permissionService.deletePermission(input.id);

    if (!permission) throw new PermissionNotFoundError('permission not found');

    return permission;
  }

  @HasPermission(PERMISSIONS.PERMISSION.UPDATE)
  @Mutation(() => Permission)
  async enablePermission(@Args('input') input: EnablePermissionInput) {
    const permission = await this.permissionService.enablePermission(input.id);

    if (!permission) throw new PermissionNotFoundError('permission not found');

    return permission;
  }

  @HasPermission(PERMISSIONS.PERMISSION.UPDATE)
  @Mutation(() => Permission)
  async disablePermission(@Args('input') input: DisablePermissionInput) {
    const permission = await this.permissionService.disablePermission(input.id);

    if (!permission) throw new PermissionNotFoundError('permission not found');

    return permission;
  }
}
