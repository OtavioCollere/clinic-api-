import { Module } from "@nestjs/common";
import { Encrypter } from "src/domain/management/application/cryptography/encrypter";
import { HashComparer } from "src/domain/management/application/cryptography/hash-comparer";
import { HashGenerator } from "src/domain/management/application/cryptography/hash-generator";
import { JwtEncrypter } from "./jwt-encrypter";
import { BcryptHasher } from "./bcrypt-hasher";

@Module({
  providers : [
    {provide : Encrypter, useClass : JwtEncrypter},
    {provide : HashComparer, useClass : BcryptHasher},
    {provide : HashGenerator, useClass : BcryptHasher}
  ],
  exports : [Encrypter, HashGenerator, HashComparer]
})
export class CryptographyModule{}