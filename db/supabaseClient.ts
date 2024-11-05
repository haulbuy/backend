import { config } from "../deps.ts";
import { createClient } from "../deps.ts";

const { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_WORKER_KEY } = config();

// Standard client for regular autthenticated requests
export const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
)

// Service client for server-side elevated permissions
export const supabaseServiceClient = createClient(
    SUPABASE_URL,
    SUPABASE_SERVICE_WORKER_KEY
)
