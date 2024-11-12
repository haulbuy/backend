import { Context } from "https://deno.land/x/oak@v10.0.0/mod.ts";
import { translateJson } from "./service.ts";

export const translate = async (ctx: Context) => {
    try {
        const = {
            text,
            targetLanguage,
        } = await ctx.request.body().value;

        try {
            const response = await translateJson(
                text,
                targetLanguage,
            );

            ctx.response.status = 200;
            ctx.response.body = response;
        } catch (err: any) {
            ctx.response.status = 500;
            ctx.response.body = { error: err.message };
        }
    }
}