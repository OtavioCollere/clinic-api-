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
exports.CreateAppointmentUseCase = void 0;
const common_1 = require("@nestjs/common");
const appointment_repository_1 = require("../../repositories/appointment-repository");
const users_repository_1 = require("../../repositories/users-repository");
const either_1 = require("../../../../../core/either/either");
const appointment_1 = require("../../../enterprise/entities/appointment");
const user_not_found_error_1 = require("../../../../../core/errors/user-not-found-error");
const invalid_interval_error_1 = require("../../../../../core/errors/invalid-interval-error");
const unique_entity_id_1 = require("../../../../../core/entities/unique-entity-id");
let CreateAppointmentUseCase = class CreateAppointmentUseCase {
    constructor(appointmentsRepository, usersRepository) {
        this.appointmentsRepository = appointmentsRepository;
        this.usersRepository = usersRepository;
    }
    async execute({ userId, name, description, duration, dateHour }) {
        const userExists = await this.usersRepository.findById(userId);
        if (!userExists) {
            return (0, either_1.makeLeft)(new user_not_found_error_1.UserNotFoundError());
        }
        const startHour = new Date(dateHour.getTime());
        const endHour = new Date(dateHour.getTime() + duration * 60 * 1000);
        const existentAppointment = await this.appointmentsRepository.findByInterval({ startHour, endHour });
        if (existentAppointment) {
            return (0, either_1.makeLeft)(new invalid_interval_error_1.InvalidIntervalError({
                existentAppointment,
                startHour,
                endHour
            }));
        }
        const appointment = new appointment_1.Appointment({
            userId: new unique_entity_id_1.UniqueEntityID(userId),
            name,
            description,
            duration,
            dateHour
        });
        await this.appointmentsRepository.create(appointment);
        return (0, either_1.makeRight)({
            appointment
        });
    }
};
exports.CreateAppointmentUseCase = CreateAppointmentUseCase;
exports.CreateAppointmentUseCase = CreateAppointmentUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [appointment_repository_1.AppointmentsRepository,
        users_repository_1.UsersRepository])
], CreateAppointmentUseCase);
//# sourceMappingURL=create-appointment.js.map