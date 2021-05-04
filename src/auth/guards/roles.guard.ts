import { CanActivate, ExecutionContext, mixin } from '@nestjs/common';
import { AuthUserDto } from '../dto/auth-user.dto';
import { Role } from '../roles/role.enum';

export const RolesGuard = (role: Role) => {
    class RolesGuardMixing implements CanActivate {
        canActivate(context: ExecutionContext): boolean {
            const user: AuthUserDto = context.switchToHttp().getRequest().user;
            const id: string = context.switchToHttp().getRequest().params.id;

            if (user.roles.includes(Role.Admin)) {
                return true;
            }

            if (user.roles.includes(role)) {
                return id && id !== user._id ? false : true;
            } else {
                return false;
            }
        }
    }

    return mixin(RolesGuardMixing);
};
