import { Module } from "@nestjs/common";
import { CryptographyModule } from "../cryptography/cryptograph.module";
import { RegisterUserUseCase } from "src/domain/management/application/use-cases/users/register-user";
import { AuthModule } from "../auth/auth.module";
import { DatabaseModule } from "../database/database.module";
import { RegisterUserController } from "./controllers/users/register-user";
import { AuthenticatheUserUseCase } from "src/domain/management/application/use-cases/users/authenticate-user";
import { AuthenticateController } from "./controllers/users/authenticate-user";
import { CreateAppointmentController } from "./controllers/appointments/create-appointment";
import { CreateAppointmentUseCase } from "src/domain/management/application/use-cases/appointments/create-appointment";
import { ConfirmAppointmentController } from "./controllers/appointments/confirm-appointment";
import { ConfirmAppointmentUseCase } from "src/domain/management/application/use-cases/appointments/confirm-appointment";
import { CancelAppointmentController } from "./controllers/appointments/cancel-appointment";
import { CancelAppointmentUseCase } from "src/domain/management/application/use-cases/appointments/cancel-appointment";


// Importar modulo em app module

// Http module precisa ter controllers / casos de uso

// Http module precisa importar DatabaseModule, Cryptograph module

@Module({
  imports : [CryptographyModule, AuthModule, DatabaseModule],
  controllers : [
    RegisterUserController,
    AuthenticateController,

    CreateAppointmentController,
    ConfirmAppointmentController,
    CancelAppointmentController
  ],
  providers : [
    RegisterUserUseCase,
    AuthenticatheUserUseCase,

    CreateAppointmentUseCase,
    ConfirmAppointmentUseCase,
    CancelAppointmentUseCase
  ]
})
export class HttpModule{}