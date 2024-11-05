import { Context } from "https://deno.land/x/oak@v10.0.0/mod.ts";
import { supabaseServiceClient } from "../../db/supabaseClient.ts";

/**
 * Extracts the user ID from the Bearer token in the request header.
 *
 * @param {Context} ctx - Oak context object
 * @returns {Promise<string | null>} - The userId if authenticated, null if unauthorized
 */
export const getUserIdFromToken = async (
    ctx: Context,
): Promise<string | null> => {
    const authHeader = ctx.request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        ctx.response.status = 401;
        ctx.response.body = { error: "Unauthorized: Missing or invalid token" };
        return null;
    }

    const token = authHeader.split(" ")[1];
    const { data, error: authError } = await supabaseServiceClient.auth
        .getUser(token);

    if (authError || !data || !data.user) {
        ctx.response.status = 401;
        ctx.response.body = { error: "Unauthorized: Invalid or expired token" };
        return null;
    }

    return data.user.id;
};
