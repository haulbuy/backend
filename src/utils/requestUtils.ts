// deno-lint-ignore-file no-explicit-any

export const parseJsonRequest = async (request: any) => {
    try {
        return await request.body().value;
    } catch (_error) {
        throw new Error("Invalid JSON body");
    }
};

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
