import { supabaseServiceClient } from "../../../db/supabaseClient.ts";

/**
 * Retrieves a few statistics for the shipping methods for the admin panel.
 *
 * @returns A promise that resolves to an object containing the statistics.
 */
export const getShippingStatistics = async () => {
  const { error, count } = await supabaseServiceClient
    .from("shipping_methods")
    .select("*", { count: "exact", head: true });

  if (error) {
    return { error: error.message };
  }

  return { total: count };
};
