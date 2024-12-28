import { Admin } from '../../admin/admin.schema';
import { Customer } from '../../customer/customer.schema';
import { ServiceProvider } from '../../service-provider/service-provider.schema';
import { UserType } from './user.type';

export type RequestUser = (Admin | ServiceProvider | Customer) & { userType: UserType };

export enum AuthProvider {
  DEFAULT = 'DEFAULT',
  GOOGLE = 'GOOGLE',
  APPLE = 'APPLE',
}
