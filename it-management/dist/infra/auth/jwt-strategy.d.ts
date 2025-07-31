import { Strategy } from 'passport-jwt';
import z from "zod";
declare const tokenPayloadSchema: z.ZodObject<{
    sub: z.ZodString;
}, z.core.$strip>;
export type UserPayload = z.infer<typeof tokenPayloadSchema>;
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    constructor();
    validate(payload: UserPayload): Promise<{
        sub: string;
    }>;
}
export {};
