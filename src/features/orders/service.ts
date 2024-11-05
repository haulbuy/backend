// deno-lint-ignore-file no-explicit-any

import { supabase, supabaseServiceClient } from "../../../db/supabaseClient.ts";

/**
 * Creates orders from the provided cart items JSON and initiates a pending
 * payment that must be fulfilled for the orders to be processed.
 * 
 * @param userId - The ID of the user making the request.
 * @param cartItems - An array of items in JSON format to be turned into orders.
 * @returns A promise that resolves to an object containing a message, the order
 *          IDs, and the payment ID if successful.
 */
export const createOrders = async (
    userId: string,
    cartItems: any[],
) => {
    // Calculate order total
    let orderTotal = 0;

    for (let i = 0; i < cartItems.length; i++) {
        const item = cartItems[i];

        orderTotal += item.selectedSku.price;
    }

    const { data: insertedPayment, error: insertPaymentError } =
        await supabaseServiceClient
            .from("payments")
            .insert({
                user_id: userId,
                amount_cny: orderTotal
            })
            .select("id")
            .single();

    if (insertPaymentError) {
        throw insertPaymentError
    }

    // Create order objects to insert from cartItems
    const orders: any[] = [];

    for (let i = 0; i < cartItems.length; i++) {
        const item = cartItems[i];

        const { data: product } = await supabaseServiceClient
            .from("products")
            .select("id")
            .eq("url", item.url)
            .maybeSingle();

        let productId = null;

        if (product) {
            productId = product.id;
        }

        const order = {
            user_id: userId,
            product_id: productId,
            name: item.title,
            quantity: item.quantity,
            status: "pending",
            image_url: item.selectedImageUrl,
            price_cny: item.selectedSku.price,
            selected_sku: item.selectedSku,
            payment_id: insertedPayment.id
        };

        orders.push(order);
    }

    // Insert orders and return message
    const { data: insertedOrders, error: insertOrdersError } =
        await supabaseServiceClient
            .from("orders")
            .insert(orders)
            .select("id");

    if (insertOrdersError) {
        throw insertOrdersError;
    }

    const insertedOrderIds = insertedOrders.map((order) => order.id);
    return {
        message: "Orders created successfully",
        orderIds: insertedOrderIds,
        paymentId: insertedPayment.id
    };
};

/**
 * Processes orders created with the `createOrders` function. Checks if payment has
 * been made for the specified orders and updates their status if paid.
 * 
 * @param orderIds - The IDs of the orders that need to be processed.
 * @returns A success message if the orders are successfully updated.
 */
export const processOrders = async (
    orderIds: string[]
) => {
    // Check if payment has been made for each order
    for (let i = 0; i < orderIds.length; i++) {
        const { data: order, error: error } = await supabaseServiceClient
            .from("orders")
            .select("*")
            .eq("id", orderIds[i])
            .single();
        
        if (error) {
            throw error;
        }

        // If the order is pending, check if the payment has been made
        if (order.status === "pending") {
            const { data: payment, error: paymentError } = await supabaseServiceClient
                .from("payments")
                .select("*")
                .eq("id", order.payment_id)
                .single();

            if (paymentError) {
                throw paymentError;
            }

            // If the payment has been made, update the order status to paid
            if (payment.status === "paid") {
                const { data: updatedOrder, error: updateError } = await supabaseServiceClient
                    .from("orders")
                    .update({ status: "paid" })
                    .eq("id", orderIds[i])
                    .single();

                if (updateError) {
                    throw updateError;
                }
            }
        }
    }

    return "Orders processed successfully";
}
