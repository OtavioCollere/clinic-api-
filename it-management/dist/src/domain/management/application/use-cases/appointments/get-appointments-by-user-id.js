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
exports.GetAppointmentsUseCaseByUserId = void 0;
const common_1 = require("@nestjs/common");
const appointment_repository_1 = require("../../repositories/appointment-repository");
const users_repository_1 = require("../../repositories/users-repository");
const either_1 = require("../../../../../core/either/either");
const user_not_found_error_1 = require("../../../../../core/errors/user-not-found-error");
let GetAppointmentsUseCaseByUserId = class GetAppointmentsUseCaseByUserId {
    constructor(usersRepository, appointmentsRepository) {
        this.usersRepository = usersRepository;
        this.appointmentsRepository = appointmentsRepository;
    }
    async execute({ userId }) {
        const userExists = await this.usersRepository.findById(userId);
        if (!userExists) {
            return (0, either_1.makeLeft)(new user_not_found_error_1.UserNotFoundError());
        }
        const appointments = await this.appointmentsRepository.findAppointmentsByUserId(userId);
        return (0, either_1.makeRight)({
            appointments
        });
    }
};
exports.GetAppointmentsUseCaseByUserId = GetAppointmentsUseCaseByUserId;
exports.GetAppointmentsUseCaseByUserId = GetAppointmentsUseCaseByUserId = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_repository_1.UsersRepository,
        appointment_repository_1.AppointmentsRepository])
], GetAppointmentsUseCaseByUserId);
//# sourceMappingURL=get-appointments-by-user-id.js.map