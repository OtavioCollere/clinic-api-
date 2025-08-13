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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfirmAppointmentController = void 0;
const common_1 = require("@nestjs/common");
const confirm_appointment_1 = require("../../../../domain/management/application/use-cases/appointments/confirm-appointment");
const zod_1 = require("zod");
const zod_validation_pipe_1 = require("../../pipes/zod-validation-pipe");
const either_1 = require("../../../../core/either/either");
const appointment_not_found_error_1 = require("../../../../core/errors/appointment-not-found-error");
const user_not_found_error_1 = require("../../../../core/errors/user-not-found-error");
const swagger_1 = require("@nestjs/swagger");
const confirmAppointmentBodySchema = zod_1.default.object({
    appointmentId: zod_1.default.string().uuid(),
    updatedBy: zod_1.default.string().uuid(),
});
let ConfirmAppointmentController = class ConfirmAppointmentController {
    constructor(confirmAppointment) {
        this.confirmAppointment = confirmAppointment;
    }
    async handle(body) {
        const { appointmentId, updatedBy } = body;
        const result = await this.confirmAppointment.execute({
            appointmentId,
            updatedBy,
        });
        if ((0, either_1.isLeft)(result)) {
            const error = (0, either_1.unwrapEither)(result);
            switch (error.constructor) {
                case appointment_not_found_error_1.AppointmentNotFoundError:
                    throw new common_1.NotFoundException(error.message);
                case user_not_found_error_1.UserNotFoundError:
                    throw new common_1.NotFoundException(error.message);
                default:
                    throw new common_1.BadRequestException(error.message);
            }
        }
        const appointment = (0, either_1.unwrapEither)(result).appointment;
        return {
            appointment,
        };
    }
};
exports.ConfirmAppointmentController = ConfirmAppointmentController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Confirm an appointment" }),
    (0, common_1.Patch)(),
    (0, common_1.HttpCode)(200),
    (0, common_1.UsePipes)(new zod_validation_pipe_1.ZodValidationPipe(confirmAppointmentBodySchema)),
    (0, swagger_1.ApiBody)({
        description: "Appointment confirmation data",
        schema: {
            type: 'object',
            properties: {
                appointmentId: { type: 'string', format: 'uuid' },
                updatedBy: { type: 'string', format: 'uuid' },
            },
            required: ['appointmentId', 'updatedBy'],
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Appointment successfully confirmed',
        schema: {
            example: {
                appointment: {
                    appointmentId: 'uuid',
                    updatedBy: 'uuid',
                    status: 'confirmed',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad Request - Validation or other issues',
        schema: {
            example: { message: 'Invalid input data.' },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Appointment or User not found',
        schema: {
            example: { message: 'Appointment or user not found.' },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ConfirmAppointmentController.prototype, "handle", null);
exports.ConfirmAppointmentController = ConfirmAppointmentController = __decorate([
    (0, common_1.Controller)('/appointments/confirm'),
    (0, swagger_1.ApiTags)('Appointments'),
    __metadata("design:paramtypes", [confirm_appointment_1.ConfirmAppointmentUseCase])
], ConfirmAppointmentController);
//# sourceMappingURL=confirm-appointment.js.map