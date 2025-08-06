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
exports.GetAppointmentsUseCase = void 0;
const common_1 = require("@nestjs/common");
const users_repository_1 = require("../../repositories/users-repository");
const either_1 = require("../../../../../core/either/either");
const appointment_not_found_error_1 = require("../../../../../core/errors/appointment-not-found-error");
const user_not_found_error_1 = require("../../../../../core/errors/user-not-found-error");
let GetAppointmentsUseCase = class GetAppointmentsUseCase {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async execute({ userId }) {
        const appointment = await this.appointmentsRepository.findById(appointmentId);
        if (!appointment) {
            return (0, either_1.makeLeft)(new appointment_not_found_error_1.AppointmentFoundError());
        }
        const userExists = await this.usersRepository.findById(updatedBy);
        if (!userExists) {
            return (0, either_1.makeLeft)(new user_not_found_error_1.UserNotFoundError());
        }
        appointment.confirmAppointment();
        await this.appointmentsRepository.save(appointment);
        return (0, either_1.makeRight)({
            appointment
        });
    }
};
exports.GetAppointmentsUseCase = GetAppointmentsUseCase;
exports.GetAppointmentsUseCase = GetAppointmentsUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_repository_1.UsersRepository])
], GetAppointmentsUseCase);
//# sourceMappingURL=TO-DO-get-appointments-by-user-id.js.map