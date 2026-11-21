import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtUserPayload } from '@nexaflow/shared-types';

export const CurrentUser = createParamDecorator(
  (data: keyof JwtUserPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as JwtUserPayload;
    return data ? user?.[data] : user;
  },
);

export const CurrentTenantId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string | undefined => {
    const request = ctx.switchToHttp().getRequest();
    return request.user?.tenantId || (request.headers['x-tenant-id'] as string);
  },
);
