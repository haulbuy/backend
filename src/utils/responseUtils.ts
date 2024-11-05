// deno-lint-ignore-file no-explicit-any

export const createJsonResponse = (
    response: any,
    status: number,
    body: object,
) => {
    response.status = status;
    response.body = body;
};

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
