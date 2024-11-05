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
    const orders: any[] = [];

    let orderTotal = 0;

    for (let i = 0; i < cartItems.length; i++) {
        const item = cartItems[i];

        orderTotal += item.selectedSku.price;
    }

    const { data: insertedPayment, error: insertPaymentError } = await supabaseServiceClient
        .from("payments")
        .insert({
            user_id: userId,
            amount_cny: orderTotal
        })

    if (insertPaymentError) {
        throw insertPaymentError
    }

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
        };

        orders.push(order);
    }

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
    for (let i = 0; i < orderIds.length; i++) {
        const { data: order, error: }
    }


}
