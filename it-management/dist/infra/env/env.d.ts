import z from "zod";
export declare const envSchema: z.ZodObject<{
    PORT: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    DATABASE_URL: z.ZodString;
    PRIVATE_KEY: z.ZodString;
    PUBLIC_KEY: z.ZodString;
}, z.core.$strip>;
export type Env = z.infer<typeof envSchema>;
