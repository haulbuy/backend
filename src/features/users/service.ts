import { supabaseServiceClient } from "../../../db/supabaseClient.ts";


export const createUser = async (
    username: string,
    email: string,
    password: string  
) => {
    const usernameRegexPattern = /^[a-z0-9_]{4,32}$/;
    const isUsernameValid = usernameRegexPattern.test(username.toLowerCase());

    if (!isUsernameValid) {
      return { error: "Username must be 4-32 characters long and contain only lowercase letters, numbers, and underscores."}
    }

}