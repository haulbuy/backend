export const getEnvVariable = (key: string) => {
    const value = Deno.env.get(key);
    if (!value) {
        throw new Error(`Missing environment variable: ${key}`);
    }
    return value;
};

export const logger = {
    info: (message: string) => console.log(`[INFO]: ${message}`),
    warn: (message: string) => console.warn(`[WARN]: ${message}`),
    error: (message: string) => console.error(`[ERROR]: ${message}`),
};
