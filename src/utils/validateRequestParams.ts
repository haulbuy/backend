// deno-lint-ignore-file no-explicit-any

export const validateRequestParams = (
    params: Record<string, any>,
    requiredFields: string[],
) => {
    for (const field of requiredFields) {
        if (!params[field]) {
            throw new Error(`Missing required parameter: ${field}`);
        }
    }
};
