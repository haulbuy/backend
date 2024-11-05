// deno-lint-ignore-file no-explicit-any

import { supabaseServiceClient } from "../../../db/supabaseClient.ts";

export const createOrders = async (
    userId: string,
    cartItems: any[],
) => {
    const _orders = [];

    for (let i = 0; i < cartItems.length; i++) {
        const item = cartItems[i];

        const { data: product } = await supabaseServiceClient
            .from('products')
            .select('id')
            .eq('url', item.url)
            .maybeSingle()
        
        let _productId = null;

        if (product) {
            _productId = product.id;
        }

        const order = {
            user_id: userId,
            product_id: _productId,
            name: item.title,
            quantity: item.quantity,
            status: "pending",
            image_url: item.selectedImageUrl,
            price_cny: item.selectedSku.price
        }

        _orders.push(order);
    }
}
