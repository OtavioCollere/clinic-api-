"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterProcedureUseCase = void 0;
const common_1 = require("@nestjs/common");
const either_1 = require("../../../../../core/either/either");
const appointment_not_found_error_1 = require("../../../../../core/errors/appointment-not-found-error");
const user_not_found_error_1 = require("../../../../../core/errors/user-not-found-error");
const procedure_1 = require("../../../enterprise/entities/procedure");
const procedures_repository_1 = require("../../repositories/procedures-repository");
const users_repository_1 = require("../../repositories/users-repository");
const appointment_repository_1 = require("../../repositories/appointment-repository");
const unique_entity_id_1 = require("../../../../../core/entities/unique-entity-id");
let RegisterProcedureUseCase = class RegisterProcedureUseCase {
    constructor(proceduresRepository, usersRepository, appointmentsRepository) {
        this.proceduresRepository = proceduresRepository;
        this.usersRepository = usersRepository;
        this.appointmentsRepository = appointmentsRepository;
    }
    async execute({ userId, appointmentId, name, product, region, value }) {
        const userExists = await this.usersRepository.findById(userId);
        if (!userExists) {
            return (0, either_1.makeLeft)(new user_not_found_error_1.UserNotFoundError());
        }
        const appointmentExists = await this.appointmentsRepository.findById(appointmentId);
        if (!appointmentExists) {
            return (0, either_1.makeLeft)(new appointment_not_found_error_1.AppointmentNotFoundError());
        }
        const procedure = procedure_1.Procedure.create({
            userId: new unique_entity_id_1.UniqueEntityID(userId),
            appointmentId: new unique_entity_id_1.UniqueEntityID(appointmentId),
            name,
            product,
            region,
            value,
        });
        await this.proceduresRepository.create(procedure);
        return (0, either_1.makeRight)({
            procedure
        });
    }
};
exports.RegisterProcedureUseCase = RegisterProcedureUseCase;
exports.RegisterProcedureUseCase = RegisterProcedureUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [procedures_repository_1.ProceduresRepository,
        users_repository_1.UsersRepository,
        appointment_repository_1.AppointmentsRepository])
], RegisterProcedureUseCase);
//# sourceMappingURL=register-procedure.js.map