import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UnifiedRequestData = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return {
      ...request.params,
      ...request.query,
      ...request.body,
    };
  },
);
