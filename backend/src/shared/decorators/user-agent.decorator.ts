import {createParamDecorator, type ExecutionContext} from "@nestjs/common";
import {Request} from "express";
import {GqlExecutionContext} from "@nestjs/graphql";

export const UserAgent = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        if (ctx.getType() === 'http') {
            const request = ctx.switchToHttp().getRequest() as Request;

            return request.headers['user-agent']
        } else {
            const context = GqlExecutionContext.create(ctx)
            return context.getContext().req.headers['user-agent']
        }
    }
)