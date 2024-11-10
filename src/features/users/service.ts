import { supabaseServiceClient } from "../../../db/supabaseClient.ts";

export const createUser = async (
    username: string,
    email: string,
    password: string  
) => {
    // Define custom password validation rules using regex
    const isValidLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[@$!%*?&]/.test(password);

    // Check each rule and collect errors if any rule fails
    const errors = [];
    if (!isValidLength) errors.push("at least 8 characters long");
    if (!hasUppercase) errors.push("at least one uppercase letter");
    if (!hasNumber) errors.push("at least one number");
    if (!hasSpecialChar) errors.push("at least one special character");

    if (errors.length > 0) {
        const errorMessage = `Password must be ${errors.join(", ")}.`;
        console.log("Password validation failed for the following reasons:");
        console.log(`- ${errorMessage}`);
        throw new Error(errorMessage);
    }

    // Proceed with user creation if validation passes
    // Add your Supabase user creation logic here
};
