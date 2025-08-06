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
exports.CreateAppointmentController = void 0;
const common_1 = require("@nestjs/common");
const zod_validation_pipe_1 = require("../../pipes/zod-validation-pipe");
const zod_1 = require("zod");
const create_appointment_1 = require("../../../../domain/management/application/use-cases/appointments/create-appointment");
const either_1 = require("../../../../core/either/either");
const user_not_found_error_1 = require("../../../../core/errors/user-not-found-error");
const invalid_interval_error_1 = require("../../../../core/errors/invalid-interval-error");
const swagger_1 = require("@nestjs/swagger");
const createAppointmentBodySchema = zod_1.default.object({
    userId: zod_1.default.string().uuid(),
    name: zod_1.default.string(),
    description: zod_1.default.string().optional(),
    duration: zod_1.default.number(),
    dateHour: zod_1.default.date(),
});
let CreateAppointmentController = class CreateAppointmentController {
    constructor(createAppointment) {
        this.createAppointment = createAppointment;
    }
    async handle(body) {
        const { userId, name, description, duration, dateHour } = body;
        const result = await this.createAppointment.execute({
            userId,
            name,
            description,
            duration,
            dateHour,
        });
        if ((0, either_1.isLeft)(result)) {
            const error = (0, either_1.unwrapEither)(result);
            switch (error.constructor) {
                case user_not_found_error_1.UserNotFoundError:
                    throw new common_1.NotFoundException(error.message);
                case invalid_interval_error_1.InvalidIntervalError:
                    throw new common_1.ConflictException(error.message);
                default:
                    throw new common_1.BadRequestException();
            }
        }
        const appointment = (0, either_1.unwrapEither)(result).appointment;
        return {
            appointment,
        };
    }
};
exports.CreateAppointmentController = CreateAppointmentController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Create a new appointment" }),
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(201),
    (0, common_1.UsePipes)(new zod_validation_pipe_1.ZodValidationPipe(createAppointmentBodySchema)),
    (0, swagger_1.ApiBody)({
        description: "Appointment creation data",
        schema: {
            type: 'object',
            properties: {
                userId: { type: 'string', format: 'uuid' },
                name: { type: 'string' },
                description: { type: 'string', nullable: true },
                duration: { type: 'number' },
                dateHour: { type: 'string', format: 'date-time' },
            },
            required: ['userId', 'name', 'duration', 'dateHour'],
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Appointment created successfully',
        schema: {
            example: {
                appointment: {
                    userId: 'uuid',
                    name: 'Doctor Appointment',
                    description: 'Routine checkup',
                    duration: 30,
                    dateHour: '2025-08-07T14:30:00Z',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad Request',
        schema: {
            example: {
                message: 'Invalid input data.',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'User not found (Not Found Exception)',
        schema: {
            example: {
                message: 'User with the specified ID does not exist.',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Invalid time interval (Conflict Exception)',
        schema: {
            example: {
                message: 'The selected time interval is invalid.',
            },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CreateAppointmentController.prototype, "handle", null);
exports.CreateAppointmentController = CreateAppointmentController = __decorate([
    (0, common_1.Controller)('/appointments'),
    (0, swagger_1.ApiTags)('Appointments'),
    __metadata("design:paramtypes", [create_appointment_1.CreateAppointmentUseCase])
], CreateAppointmentController);
//# sourceMappingURL=create-appointment.js.map