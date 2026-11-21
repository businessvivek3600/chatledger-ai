import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, PERMISSIONS_KEY } from '../decorators/roles.decorator';
import { UserRole, Permission, JwtUserPayload } from '@nexaflow/shared-types';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles && !requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtUserPayload;

    if (!user) {
      throw new ForbiddenException('User is unauthenticated');
    }

    // Super Admin has unrestricted platform access
    if (user.role === UserRole.SUPER_ADMIN) {
      return true;
    }

    // Check Roles
    if (requiredRoles && requiredRoles.length > 0) {
      const hasRole = requiredRoles.includes(user.role);
      if (!hasRole) {
        throw new ForbiddenException(`Requires one of roles: ${requiredRoles.join(', ')}`);
      }
    }

    // Check Granular Permissions
    if (requiredPermissions && requiredPermissions.length > 0) {
      const userPermissions = user.permissions || [];
      const hasWildcard = (userPermissions as any[]).includes('*');
      if (hasWildcard) {
        return true;
      }
      const hasAllPermissions = requiredPermissions.every((perm) =>
        userPermissions.includes(perm),
      );
      if (!hasAllPermissions) {
        throw new ForbiddenException(
          `Missing required permissions: ${requiredPermissions.join(', ')}`,
        );
      }
    }

    return true;
  }
}
