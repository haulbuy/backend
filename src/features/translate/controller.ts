// deno-lint-ignore-file no-explicit-any

import { Context } from "https://deno.land/x/oak@v10.0.0/mod.ts";
import { translateData } from "./service.ts";

/**
 * Translates the provided text to the specified target language.
 *
 * @param {Context} ctx - The context object containing the request and response.
 *
 * @returns {Promise<void>} - A promise that resolves when the translation is complete.
 *
 * @throws {Error} - Throws an error if the request data is invalid or if the translation fails.
 */
export const translate = async (ctx: Context) => {
  try {
    const { text, targetLanguage } = await ctx.request.body().value;

    try {
      const response = await translateData(text, targetLanguage);

      ctx.response.status = 200;
      ctx.response.body = response;
    } catch (err: any) {
      ctx.response.status = 500;
      ctx.response.body = { error: err.message };
    }
  } catch (_err: any) {
    ctx.response.status = 400;
    ctx.response.body = { error: "Invalid request data" };
  }
};
