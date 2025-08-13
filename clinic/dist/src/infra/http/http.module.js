"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpModule = void 0;
const common_1 = require("@nestjs/common");
const cryptograph_module_1 = require("../cryptography/cryptograph.module");
const register_user_1 = require("../../domain/management/application/use-cases/users/register-user");
const auth_module_1 = require("../auth/auth.module");
const database_module_1 = require("../database/database.module");
const register_user_2 = require("./controllers/users/register-user");
const authenticate_user_1 = require("../../domain/management/application/use-cases/users/authenticate-user");
const authenticate_user_2 = require("./controllers/users/authenticate-user");
const create_appointment_1 = require("./controllers/appointments/create-appointment");
const create_appointment_2 = require("../../domain/management/application/use-cases/appointments/create-appointment");
const confirm_appointment_1 = require("./controllers/appointments/confirm-appointment");
const confirm_appointment_2 = require("../../domain/management/application/use-cases/appointments/confirm-appointment");
const cancel_appointment_1 = require("./controllers/appointments/cancel-appointment");
const cancel_appointment_2 = require("../../domain/management/application/use-cases/appointments/cancel-appointment");
const get_appointments_by_user_id_1 = require("./controllers/appointments/get-appointments-by-user-id");
const get_appointments_by_user_id_2 = require("../../domain/management/application/use-cases/appointments/get-appointments-by-user-id");
const fetch_appointments_1 = require("../../domain/management/application/use-cases/appointments/fetch-appointments");
const fetch_appointment_1 = require("./controllers/appointments/fetch-appointment");
const register_procedure_1 = require("./controllers/procedures/register-procedure");
const register_procedure_2 = require("../../domain/management/application/use-cases/procedures/register-procedure");
const get_procedure_by_user_id_1 = require("./controllers/procedures/get-procedure-by-user-id");
const get_procedures_by_user_id_1 = require("../../domain/management/application/use-cases/procedures/get-procedures-by-user-id");
const fetch_procedures_1 = require("../../domain/management/application/use-cases/procedures/fetch-procedures");
const fetch_procedures_2 = require("./controllers/procedures/fetch-procedures");
const edit_procedure_1 = require("./controllers/procedures/edit-procedure");
const edit_procedure_2 = require("../../domain/management/application/use-cases/procedures/edit-procedure");
let HttpModule = class HttpModule {
};
exports.HttpModule = HttpModule;
exports.HttpModule = HttpModule = __decorate([
    (0, common_1.Module)({
        imports: [cryptograph_module_1.CryptographyModule, auth_module_1.AuthModule, database_module_1.DatabaseModule],
        controllers: [
            register_user_2.RegisterUserController,
            authenticate_user_2.AuthenticateController,
            create_appointment_1.CreateAppointmentController,
            confirm_appointment_1.ConfirmAppointmentController,
            cancel_appointment_1.CancelAppointmentController,
            get_appointments_by_user_id_1.GetAppointmentsByUserIdController,
            fetch_appointment_1.FetchAppointmentsController,
            register_procedure_1.RegisterProcedureController,
            get_procedure_by_user_id_1.GetProcedureByUserIdController,
            fetch_procedures_2.FetchProceduresController,
            edit_procedure_1.EditProcedureController
        ],
        providers: [
            register_user_1.RegisterUserUseCase,
            authenticate_user_1.AuthenticatheUserUseCase,
            create_appointment_2.CreateAppointmentUseCase,
            confirm_appointment_2.ConfirmAppointmentUseCase,
            cancel_appointment_2.CancelAppointmentUseCase,
            get_appointments_by_user_id_2.GetAppointmentsUseCaseByUserId,
            fetch_appointments_1.FetchAppointmentsUseCase,
            register_procedure_2.RegisterProcedureUseCase,
            get_procedures_by_user_id_1.GetProceduresByUserIdUseCase,
            fetch_procedures_1.FetchProceduresUseCase,
            edit_procedure_2.EditProcedureUseCase
        ]
    })
], HttpModule);
//# sourceMappingURL=http.module.js.map