// deno-lint-ignore-file no-explicit-any no-unused-vars

import { Context } from "https://deno.land/x/oak@v10.0.0/mod.ts";
import { calculateShippingSugargoo } from "./service.ts";

/**
 * Calculates the shipping cost based on the destination and package dimensions.
 *
 * @param ctx - The Oak context object containing the request.
 */
export const calculateShipping = async (ctx: Context) => {
  try {
    const {
      country,
      region,
      weight,
      height,
      width,
      length,
      forbiddenAttributeIds,
    } = await ctx.request.body().value;

    try {
      const response = await calculateShippingSugargoo(
        country,
        region,
        weight,
        height,
        width,
        length,
        forbiddenAttributeIds
      );

      ctx.response.status = 200;
      ctx.response.body = response;
    } catch (err: any) {
      ctx.response.status = 500;
      ctx.response.body = { error: err.message };
    }
  } catch (err: any) {
    ctx.response.status = 400;
    ctx.response.body = { error: "Invalid request data" };
  }
};
