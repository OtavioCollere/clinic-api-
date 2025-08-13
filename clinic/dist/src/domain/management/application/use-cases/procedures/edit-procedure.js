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
exports.EditProcedureUseCase = void 0;
const common_1 = require("@nestjs/common");
const either_1 = require("../../../../../core/either/either");
const appointment_not_found_error_1 = require("../../../../../core/errors/appointment-not-found-error");
const user_not_found_error_1 = require("../../../../../core/errors/user-not-found-error");
const procedures_repository_1 = require("../../repositories/procedures-repository");
const users_repository_1 = require("../../repositories/users-repository");
const appointment_repository_1 = require("../../repositories/appointment-repository");
const unique_entity_id_1 = require("../../../../../core/entities/unique-entity-id");
const procedure_not_found_error_1 = require("../../../../../core/errors/procedure-not-found-error");
let EditProcedureUseCase = class EditProcedureUseCase {
    constructor(proceduresRepository, usersRepository, appointmentsRepository) {
        this.proceduresRepository = proceduresRepository;
        this.usersRepository = usersRepository;
        this.appointmentsRepository = appointmentsRepository;
    }
    async execute({ procedureId, updatedBy, userId, appointmentId, name, product, region, value }) {
        const procedure = await this.proceduresRepository.findById(procedureId);
        if (!procedure)
            return (0, either_1.makeLeft)(new procedure_not_found_error_1.ProcedureNotFoundError());
        if (updatedBy) {
            const updater = await this.usersRepository.findById(updatedBy);
            if (!updater)
                return (0, either_1.makeLeft)(new user_not_found_error_1.UserNotFoundError());
        }
        if (userId) {
            const userExists = await this.usersRepository.findById(userId);
            if (!userExists)
                return (0, either_1.makeLeft)(new user_not_found_error_1.UserNotFoundError());
            procedure.userId = new unique_entity_id_1.UniqueEntityID(userId);
        }
        if (appointmentId) {
            const appointmentExists = await this.appointmentsRepository.findById(appointmentId);
            if (!appointmentExists)
                return (0, either_1.makeLeft)(new appointment_not_found_error_1.AppointmentNotFoundError());
            procedure.appointmentId = new unique_entity_id_1.UniqueEntityID(appointmentId);
        }
        if (name)
            procedure.name = name;
        if (typeof value !== "undefined")
            procedure.value = value;
        if (typeof product !== "undefined")
            procedure.product = product;
        if (typeof region !== "undefined")
            procedure.region = region;
        await this.proceduresRepository.save(procedure);
        return (0, either_1.makeRight)({ procedure });
    }
};
exports.EditProcedureUseCase = EditProcedureUseCase;
exports.EditProcedureUseCase = EditProcedureUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [procedures_repository_1.ProceduresRepository,
        users_repository_1.UsersRepository,
        appointment_repository_1.AppointmentsRepository])
], EditProcedureUseCase);
//# sourceMappingURL=edit-procedure.js.map