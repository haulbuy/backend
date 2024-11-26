// deno-lint-ignore-file no-explicit-any no-unused-vars

import { Context } from "https://deno.land/x/oak@v10.0.0/mod.ts";

import { getUserIdFromToken } from "../../utils/authUtils.ts";

import { createParcel } from "./service.ts";

/**
 * Creates a new parcel based on the provided order IDs, address ID, and
 * shipping method.
 * 
 * @param ctx - The context object containing the request and response.
 * 
 * @returns A promise that resolves when the parcel is created.
 * 
 * @throws Throws an error if the request data is invalid or if there is an
 *         issue creating the parcel.
 */
export const create = async (ctx: Context) => {
  try {
    const userId = await getUserIdFromToken(ctx);
    if (!userId) return;

    const { orderIds, addressId, shippingMethod } = await ctx.request.body()
      .value;

    try {
      const response = await createParcel(
        userId,
        orderIds,
        addressId,
        shippingMethod
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
