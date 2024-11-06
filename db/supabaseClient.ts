import { createClient } from "../deps.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") || "";
const SUPABASE_SERVICE_WORKER_KEY = Deno.env.get("SUPABASE_SERVICE_WORKER_KEY") || "";

// Standard client for regular authenticated requests
export const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

// Service client for server-side elevated permissions
export const supabaseServiceClient = createClient(
    SUPABASE_URL,
    SUPABASE_SERVICE_WORKER_KEY
);
