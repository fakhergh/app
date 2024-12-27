import { PermissionAction, PermissionType } from '@/modules/permission/permission.schema';

export const PERMISSIONS: Partial<Record<PermissionType, Partial<Record<PermissionAction, string>>>> = Object.keys(
  PermissionType,
).reduce((prev, permission) => {
  prev[permission] = {
    [PermissionAction.READ]: `${permission}:${PermissionAction.READ}`,
    [PermissionAction.CREATE]: `${permission}:${PermissionAction.CREATE}`,
    [PermissionAction.UPDATE]: `${permission}:${PermissionAction.UPDATE}`,
    [PermissionAction.DELETE]: `${permission}:${PermissionAction.DELETE}`,
  };
  return prev;
}, {});
