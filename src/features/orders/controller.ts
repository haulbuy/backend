import { Context } from "https://deno.land/x/oak@v10.0.0/mod.ts";
import { createOrders } from "./service.ts";

export const create = async (ctx: Context) => {
    try {
        const { cartItems } = await ctx.request.body().value;

        createOrders(cartItems)

        ctx.response.status = 200;
        ctx.response.body = 

    } catch (error: any) {
        ctx.response.status = 400;
        ctx.response.body = { error: "Invalid request data " };
    }
};
