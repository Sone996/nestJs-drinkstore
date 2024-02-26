import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import type { JwtPayload } from '../jwt-payload.interface';

export const Jwt = createParamDecorator(
  (_: JwtPayload, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return { user: { ...request }, userId: request.user.id };
  },
);
