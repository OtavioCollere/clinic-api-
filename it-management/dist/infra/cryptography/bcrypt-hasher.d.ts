import type { HashComparer } from "src/domain/management/application/cryptography/hash-comparer";
import type { HashGenerator } from "src/domain/management/application/cryptography/hash-generator";
export declare class BcryptHasher implements HashGenerator, HashComparer {
    private PASSWORD_SALT_LENGTH;
    hash(plainText: string): Promise<string>;
    compare(value: string, hashedPassword: string): Promise<boolean>;
}
