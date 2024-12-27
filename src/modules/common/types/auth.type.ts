import { Admin } from '@/modules/admin/admin.schema';
import { UserType } from '@/modules/common/types/user.type';
import { Customer } from '@/modules/customer/customer.schema';
import { ServiceProvider } from '@/modules/service-provider/service-provider.schema';

export type RequestUser = (Admin | ServiceProvider | Customer) & { userType: UserType };

export enum AuthProvider {
  DEFAULT = 'DEFAULT',
  GOOGLE = 'GOOGLE',
  APPLE = 'APPLE',
}
