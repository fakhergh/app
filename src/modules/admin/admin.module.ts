import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { RoleModule } from '../role/role.module';
import { AdminResolver } from './admin.resolver';
import { Admin, AdminSchema } from './admin.schema';
import { AdminService } from './admin.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]), RoleModule],
  providers: [AdminResolver, AdminService],
  exports: [AdminService],
})
export class AdminModule {}
