import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { UserRole, JwtUserPayload } from '@nexaflow/shared-types';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtUserPayload;

    if (!user) {
      return true;
    }

    // Platform admins have platform-level access, but default to safe audit
    if (user.role === UserRole.SUPER_ADMIN || user.role === UserRole.PLATFORM_SUPPORT) {
      return true;
    }

    // For all tenant-scoped users, tenantId must be present
    if (!user.tenantId) {
      throw new ForbiddenException('User is not associated with an active workspace tenant');
    }

    // Attach tenantId firmly to request object for easy query scoping
    request.tenantId = user.tenantId;
    return true;
  }
}
