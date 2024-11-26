// deno-lint-ignore-file no-explicit-any no-unused-vars

import { Context } from "https://deno.land/x/oak@v10.0.0/mod.ts";

import { getUserIdFromToken } from "../../utils/authUtils.ts";

import { createOrders, processOrders } from "./service.ts";

/**
 * Creates orders from the provided cart items JSON and initiates a pending
 * payment that must be fulfilled for the orders to be processed.
 *
 * @param ctx - The Oak context object containing the request.
 */
export const create = async (ctx: Context) => {
  try {
    const userId = await getUserIdFromToken(ctx);
    if (!userId) return;

    const { cartItems } = await ctx.request.body().value;

    try {
      const response = await createOrders(userId, cartItems);

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

/**
 * Processes the orders with the provided order IDs.
 *
 * @param ctx - The Oak context object containing the request.
 */
export const process = async (ctx: Context) => {
  try {
    const userId = await getUserIdFromToken(ctx);
    if (!userId) return;

    const { orderIds } = await ctx.request.body().value;

    try {
      const response = await processOrders(orderIds);

      ctx.response.status = 200;
      ctx.response.body = { message: response };
    } catch (err: any) {
      ctx.response.status = 500;
      ctx.response.body = { error: err.message };
    }
  } catch (err: any) {
    ctx.response.status = 500;
    ctx.response.body = { error: "Invalid request data" };
  }
};
