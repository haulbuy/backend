// deno-lint-ignore-file no-explicit-any no-unused-vars

import { Context } from "https://deno.land/x/oak@v10.0.0/mod.ts";

import { getUserIdFromToken } from "../../utils/authUtils.ts";

import { processBalancePayment } from "./service.ts";

/**
 * Processes a payment by updating the balance and payment status.
 *
 * @param ctx - The Oak context object containing the request.
 */
export const balanceProcess = async (ctx: Context) => {
  try {
    const userId = await getUserIdFromToken(ctx);
    if (!userId) return;

    const { paymentId } = await ctx.request.body().value;

    try {
      const response = await processBalancePayment(paymentId);

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
