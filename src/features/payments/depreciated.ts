// deno-lint-ignore-file no-explicit-any

import { supabaseServiceClient } from "../../../db/supabaseClient.ts";

export const processPayment = async (
    userId: string,
    cartItems: any[],
    paymentMethod: string,
) => {
    if (paymentMethod !== "balance") {
        throw new Error("Unsupported payment method");
    }

    // Retrieve user's balance
    const { data: balances, error: balanceError } = await supabaseServiceClient
        .from("balances")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1);

    if (balanceError || balances.length === 0) {
        throw new Error("Unable to retrieve user balance");
    }

    const currentBalance = balances[0].balance_cny;

    // Calculate total amount for cart items
    let totalAmount = 0;
    cartItems.forEach((item) => {
        const itemPrice = item.selectedSku?.price;
        if (itemPrice) {
            totalAmount += item.quantity * itemPrice;
        } else {
            console.warn(`Price not found for item with title: ${item.title}`);
        }
    });

    if (totalAmount > currentBalance) {
        throw new Error("Insufficient balance");
    }

    const newBalance = currentBalance - totalAmount;

    // Update the balance
    const { error: balanceUpdateError } = await supabaseServiceClient.from(
        "balances",
    ).insert([
        {
            user_id: userId,
            update_type: "payment",
            amount_cny: totalAmount,
            old_balance_cny: currentBalance,
            balance_cny: newBalance,
        },
    ]);

    if (balanceUpdateError) {
        throw balanceUpdateError;
    }

    // Create orders
    const orders = cartItems.map((item) => ({
        user_id: userId,
        name: item.title,
        quantity: item.quantity,
        status: "paid",
        image_url: item.selectedImageUrl,
        price_cny: item.selectedSku.price,
        selected_sku: item.selectedSku,
    }));

    const { error: orderInsertError } = await supabaseServiceClient.from(
        "orders",
    ).insert(orders);

    if (orderInsertError) {
        throw orderInsertError;
    }

    return {
        message: "Payment captured and orders created successfully",
        newBalance,
    };
};
