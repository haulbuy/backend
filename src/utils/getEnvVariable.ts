export const getEnvVariable = (key: string) => {
    const value = Deno.env.get(key);
    if (!value) {
        throw new Error(`Missing environment variable: ${key}`);
    }
    return value;
};
