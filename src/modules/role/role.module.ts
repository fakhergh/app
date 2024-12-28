import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PermissionModule } from '../permission/permission.module';
import { RoleResolver } from './role.resolver';
import { Role, RoleSchema } from './role.schema';
import { RoleService } from './role.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]), PermissionModule],
  providers: [RoleResolver, RoleService],
  exports: [RoleService],
})
export class RoleModule {}
