// deno-lint-ignore-file no-explicit-any

import { processPayment } from "./service.ts";
import { parseJsonRequest } from "../../utils/parseJsonRequest.ts";
import { createJsonResponse } from "../../utils/createJsonResponse.ts";
import { handleErrorResponse } from "../../utils/handleErrorResponse.ts";
import { validateRequestParams } from "../../utils/validateRequestParams.ts";

export const handleCapturePayment = async (
    { request, response }: { request: any; response: any },
) => {
    try {
        const { cartItems, paymentMethod, userId } = await parseJsonRequest(
            request,
        );

        validateRequestParams({ cartItems, paymentMethod, userId }, [
            "cartItems",
            "paymentMethod",
            "userId",
        ]);

        const result = await processPayment(userId, cartItems, paymentMethod);

        createJsonResponse(response, 200, { success: true, data: result });
    } catch (error) {
        handleErrorResponse(response, error as Error);
    }
};
