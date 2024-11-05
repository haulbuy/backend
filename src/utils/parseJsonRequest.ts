// deno-lint-ignore-file no-explicit-any

export const parseJsonRequest = async (request: any) => {
    try {
        return await request.body().value;
    } catch (_error) {
        throw new Error("Invalid JSON body");
    }
};
