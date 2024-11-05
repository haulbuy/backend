// deno-lint-ignore-file no-explicit-any

import { supabaseServiceClient } from "../../../db/supabaseClient.ts";

export const createOrders = async (
    userId: string,
    cartItems: any[],
) => {
    const orders = [];

    for (let i = 0; i < cartItems.length; i++) {
        let { data: product } = await supabaseServiceClient
            .from('products')
            .select('id')
            .eq('url', cartItems[i].url)
            .maybeSingle()
        
        let productId = null;

        if (product) {
                
        }
    }

    const orders2 = cartItems.map((item) => ({
        user_id: userId,
        name: item.title,
        quantity = item.quantity,
        status: "paid",
        image_url: item.selectedImageUrl,
        price_cny: item.selectedSku.price,

    }));
}
