import { config, createClient } from "../deps.ts";

const { SUPABASE_URL,SUPABASE_ANON_KEY, SUPABASE_SERVICE_WORKER_KEY } = config();

export const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
)