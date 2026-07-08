import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@prisma/client';

export const ROLES_KEY = 'roles';

export function Roles(...roles: UserRole[]) {
    console.log(SetMetadata(ROLES_KEY, roles));
    
    return SetMetadata(ROLES_KEY, roles);
}
