// deno-lint-ignore-file no-explicit-any

import { supabaseServiceClient } from "../../../db/supabaseClient.ts";

export const createOrders = async (
    userId: string,
    cartItems: any[],
) => {
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
