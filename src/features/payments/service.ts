import { supabaseServiceClient } from "../../../db/supabaseClient.ts";

/**
 * Processes a payment by updating the balance and payment status.
 * 
 * @param paymentId - The ID of the payment to process.
 * @returns A promise that resolves to an object containing a message if
 *          successful, or an error message if not.
 */
export const processBalancePayment = async (
    paymentId: string,
) => {
    // Get the payment and balance
    const { data: payment, error: paymentError } = await supabaseServiceClient
        .from("payments")
        .select("*")
        .eq("id", paymentId)
        .single();

    if (paymentError) {
        return { error: `Payment with ID ${paymentId} could not be processed: ${paymentError.message}` };
    }

    const { data: balance, error: balanceError } = await supabaseServiceClient
        .from("balances")
        .select("*")
        .eq("id", payment.balance_id)
        .single();

    if (balanceError) {
        return { error: `Payment with ID ${paymentId} could not be processed: ${balanceError.message}` };
    }

    // Check balance and payment amount
    if (balance.amount_cny - payment.amount_cny < 0) {
        return { error: "Insufficient balance" };
    }

    // Update the balance
    const { data: _updatedBalance, error: updateError } = await supabaseServiceClient
        .from("balances")
        .update({ amount_cny: balance.amount_cny - payment.amount_cny })
        .eq("id", payment.balance_id)
        .single();

    if (updateError) {
        return { error: `Payment with ID ${paymentId} could not be processed: ${updateError.message}` };
    }

    // Update payment status
    const { data: _updatedPayment, error: paymentUpdateError } = await supabaseServiceClient
        .from("payments")
        .update({ status: "paid" })
        .eq("id", paymentId)
        .single();
    
    if (paymentUpdateError) {
        return { error: `Payment with ID ${paymentId} could not be processed: ${paymentUpdateError.message}` };
    }

    return { message: "Payment processed successfully" };
};
