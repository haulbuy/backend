import { Context } from "https://deno.land/x/oak@v10.0.0/mod.ts";

export const create = async (ctx: Context) => {
    try {
        const { cartItems } = await ctx.request.body().value;
    } catch (error: any) {

    }
}
