import { Module } from "@nestjs/common";
import { CryptographyModule } from "../cryptography/cryptograph.module";
import { RegisterUserUseCase } from "src/domain/management/application/use-cases/users/register-user";
import { AuthModule } from "../auth/auth.module";
import { DatabaseModule } from "../database/database.module";
import { RegisterUserController } from "./controllers/register-user";
import { AuthenticatheUserUseCase } from "src/domain/management/application/use-cases/users/authenticate-user";
import { AuthenticateController } from "./controllers/authenticate-user";


// Importar modulo em app module

// Http module precisa ter controllers / casos de uso

// Http module precisa importar DatabaseModule, Cryptograph module

@Module({
  imports : [CryptographyModule, AuthModule, DatabaseModule],
  controllers : [
    RegisterUserController,
    AuthenticateController
  ],
  providers : [
    RegisterUserUseCase,
    AuthenticatheUserUseCase
  ]
})
export class HttpModule{}