// deno-lint-ignore-file no-explicit-any

export const handleErrorResponse = (
    response: any,
    error: Error,
    status: number = 500,
) => {
    response.status = status;
    response.body = {
        success: false,
        error: error.message,
    };
};
