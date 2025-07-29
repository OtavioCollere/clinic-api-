import type { HashComparer } from "src/domain/management/application/cryptography/hash-comparer";
import type { HashGenerator } from "src/domain/management/application/cryptography/hash-generator";

export class FakeHasher implements HashComparer, HashGenerator{
  async compare(value: string, hashedPassword: string): Promise<boolean> {
    return hashedPassword === `${value}-hashed`;
  }

  async hash(plainText: string): Promise<string> {
    return `${plainText}-hashed`;
  }
  
}