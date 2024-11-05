// deno-lint-ignore-file no-explicit-any no-unused-vars

import { Context } from "https://deno.land/x/oak@v10.0.0/mod.ts";
import { createOrders } from "./service.ts";
import { getUserIdFromToken } from "../../utils/authUtils.ts";

export const create = async (ctx: Context) => {
    try {
        const userId = await getUserIdFromToken(ctx);
        if (!userId) return;

        const { cartItems } = await ctx.request.body().value;

        try {
            const response = await createOrders(userId, cartItems)

            ctx.response.status = 200;
            ctx.response.body = response;
        } catch (err: any) {
            ctx.response.status = 500;
            ctx.response.body = { error: err.message };
        }
    } catch (err: any) {
        ctx.response.status = 400;
        ctx.response.body = { err: "Invalid request data " };
    }
};
