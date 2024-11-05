// deno-lint-ignore-file no-explicit-any
export const createJsonResponse = (
    response: any,
    status: number,
    body: object,
) => {
    response.status = status;
    response.body = body;
};
