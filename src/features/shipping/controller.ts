// deno-lint-ignore-file no-explicit-any no-unused-vars

import { Context } from "https://deno.land/x/oak@v10.0.0/mod.ts";

import { getUserIdFromToken } from "../../utils/authUtils.ts";

import { getShippingStatistics } from "./service.ts";

export const shippingStatistics = async (ctx: Context) => {
  try {
    const userId = await getUserIdFromToken(ctx);
    if (!userId) return;

    try {
      const response = await getShippingStatistics();

      if (response.error) {
        ctx.response.status = 400;
        ctx.response.body = { error: response.error };
      } else {
        ctx.response.status = 200;
        ctx.response.body = response;
      }
    } catch (err: any) {
      ctx.response.status = 500;
      ctx.response.body = { error: err.message };
    }
  } catch (err: any) {
    ctx.response.status = 400;
    ctx.response.body = { error: "Invalid request data" };
  }
};
