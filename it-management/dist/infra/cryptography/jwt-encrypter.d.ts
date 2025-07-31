import { JwtService } from "@nestjs/jwt";
import type { Encrypter } from "src/domain/management/application/cryptography/encrypter";
export declare class JwtEncrypter implements Encrypter {
    private jwtService;
    constructor(jwtService: JwtService);
    encrypt(payload: Record<string, unknown>): Promise<string>;
}
