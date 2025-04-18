import { SetMetadata } from '@nestjs/common';
import { roleEnum } from 'src/config/enums';


export const ROLES_KEY = 'roles';
export const Roles = (...roles: roleEnum[]) => SetMetadata(ROLES_KEY, roles);
