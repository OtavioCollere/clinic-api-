import { Injectable } from "@nestjs/common";
import { compare, hash } from "bcryptjs";
import type { HashComparer } from "src/domain/management/application/cryptography/hash-comparer";
import type { HashGenerator } from "src/domain/management/application/cryptography/hash-generator";

@Injectable()
export class BcryptHasher implements HashGenerator, HashComparer{
  private PASSWORD_SALT_LENGTH = 6;

  async hash(plainText: string): Promise<string> {
      return hash(plainText, this.PASSWORD_SALT_LENGTH)
  }

  compare(value: string, hashedPassword: string): Promise<boolean> {
    return compare(value, hashedPassword)
  }
  
}