// deno-lint-ignore-file no-explicit-any

import { processPayment } from "./service.ts";
import { parseJsonRequest } from "../../utils/parseJsonRequest.ts";
import { createJsonResponse } from "../../utils/createJsonResponse.ts";
import { handleErrorResponse } from "../../utils/handleErrorResponse.ts";

export const handleCapturePayment = async (
    { request, response }: { request: any; response: any },
) => {
    try {
        const { cart_items, payment_method, user_id } = await parseJsonRequest(
            request,
        );

        if (!user_id || !cart_items || !payment_method) {
            throw new Error("Missing required fields");
        }

        const result = await processPayment(
            user_id,
            cart_items,
            payment_method,
        );

        createJsonResponse(response, 200, { success: true, data: result });
    } catch (error) {
        handleErrorResponse(response, error as Error);
    }
};
