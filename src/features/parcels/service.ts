// deno-lint-ignore-file no-explicit-any

import { supabaseServiceClient } from "../../../db/supabaseClient.ts";

export const createParcel = async (
  userId: string,
  orderIds: string[],
  addressId: string,
  shippingMethod: any
) => {
  // Calculate order total and create payment record
  const total = shippingMethod.estimateTotalFee;

  const { data: insertedPayment, error: insertPaymentError } =
    await supabaseServiceClient
      .from("payments")
      .insert({
        user_id: userId,
        amount_cny: total,
      })
      .select("id")
      .single();

  if (insertPaymentError) {
    throw insertPaymentError;
  }

  // Calculate total weight and volume from orders
  let weight = 0;
  let volume = 0;

  for (let i = 0; i < orderIds.length; i++) {
    const orderId = orderIds[i];

    const { data: order } = await supabaseServiceClient
      .from("orders")
      .select("weight_g, volume_cm3")
      .eq("id", orderId)
      .single();

    if (order) {
      weight += order.weight_g;
      volume += order.volume_cm3;
    } else {
      throw new Error(`Order with ID ${orderId} not found`);
    }
  }

  // Create parcel object to insert
  const { data: insertedParcel, error: insertParcelError } =
    await supabaseServiceClient
      .from("parcels")
      .insert({
        user_id: userId,
        address_id: addressId,
        shipping_method: shippingMethod,
        status: "pending",
        payment_id: insertedPayment.id,
        total_cny: total,
        weight_g: weight,
        volume_cm3: volume,
      })
      .select("id")
      .single();

  if (insertParcelError) {
    throw insertParcelError;
  }

  // Update orders to reference parcel
  for (let i = 0; i < orderIds.length; i++) {
    const orderId = orderIds[i];

    const { error: updateOrderError } = await supabaseServiceClient
      .from("orders")
      .update({
        parcel_id: insertedParcel.id,
        status: "packaged",
      })
      .eq("id", orderId);

    if (updateOrderError) {
      throw updateOrderError;
    }
  }

  return {
    message: "Parcel created successfully",
    parcelId: insertedParcel.id,
    paymentId: insertedPayment.id,
  };
};
