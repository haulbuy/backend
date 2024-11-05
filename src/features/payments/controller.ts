import { processPayment } from "./service.ts";
import { parseJsonRequest } from "../../utils/parseJsonRequest.ts";
import { createJsonResponse } from "../../utils/createJsonResponse.ts";
import { handleErrorResponse } from "../../utils/handleErrorResponse.ts";

export const handleCapturePayment = async (
    { request, response }: { request: any; response: any },
) => {
    try {
        // Parse the request JSON
        const { cart_items, payment_method, user_id } = await parseJsonRequest(
            request,
        );

        // Validate the required parameters
        if (!user_id || !cart_items || !payment_method) {
            throw new Error("Missing required fields");
        }

        // Call the service function to process the payment
        const result = await processPayment(
            user_id,
            cart_items,
            payment_method,
        );

        // Send successful response
        createJsonResponse(response, 200, { success: true, data: result });
    } catch (error) {
        handleErrorResponse(response, error);
    }
};
