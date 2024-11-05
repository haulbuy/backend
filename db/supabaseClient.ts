import { config } from "../deps.ts";
import { createClient } from "../deps.ts";

const { SUPABASE_URL,SUPABASE_ANON_KEY, SUPABASE_SERVICE_WORKER_KEY } = config();

export const supabaseClient = createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
)

export const supabaseServiceClient = createClient(
    SUPABASE_URL,
    SUPABASE_SERVICE_WORKER_KEY
)
