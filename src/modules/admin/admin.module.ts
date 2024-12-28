import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AdminResolver } from '../admin/admin.resolver';
import { Admin, AdminSchema } from '../admin/admin.schema';
import { AdminService } from '../admin/admin.service';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]), RoleModule],
  providers: [AdminResolver, AdminService],
  exports: [AdminService],
})
export class AdminModule {}
