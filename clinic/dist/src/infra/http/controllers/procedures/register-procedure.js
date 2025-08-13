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
exports.RegisterProcedureController = void 0;
const common_1 = require("@nestjs/common");
const zod_validation_pipe_1 = require("../../pipes/zod-validation-pipe");
const zod_1 = require("zod");
const either_1 = require("../../../../core/either/either");
const user_not_found_error_1 = require("../../../../core/errors/user-not-found-error");
const swagger_1 = require("@nestjs/swagger");
const register_procedure_1 = require("../../../../domain/management/application/use-cases/procedures/register-procedure");
const appointment_not_found_error_1 = require("../../../../core/errors/appointment-not-found-error");
const registerProcedureBodySchema = zod_1.default.object({
    userId: zod_1.default.string().uuid(),
    appointmentId: zod_1.default.string().uuid(),
    name: zod_1.default.enum(['BOTOX', 'PREENCHIMENTO', 'LAVIEEN']),
    product: zod_1.default.string().optional(),
    region: zod_1.default.string(),
    value: zod_1.default.number()
});
let RegisterProcedureController = class RegisterProcedureController {
    constructor(registerProcedure) {
        this.registerProcedure = registerProcedure;
    }
    async handle(body) {
        const { userId, appointmentId, name, product, region, value } = body;
        const result = await this.registerProcedure.execute({
            userId,
            appointmentId,
            name,
            product,
            region,
            value
        });
        if ((0, either_1.isLeft)(result)) {
            const error = (0, either_1.unwrapEither)(result);
            switch (error.constructor) {
                case appointment_not_found_error_1.AppointmentNotFoundError:
                    throw new common_1.NotFoundException(error.message);
                case user_not_found_error_1.UserNotFoundError:
                    throw new common_1.NotFoundException(error.message);
                default:
                    throw new common_1.BadRequestException();
            }
        }
        const { procedure } = (0, either_1.unwrapEither)(result);
        return { procedure };
    }
};
exports.RegisterProcedureController = RegisterProcedureController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Register a new procedure" }),
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(201),
    (0, common_1.UsePipes)(new zod_validation_pipe_1.ZodValidationPipe(registerProcedureBodySchema)),
    (0, swagger_1.ApiBody)({
        description: "Procedure registration data",
        schema: {
            type: 'object',
            properties: {
                userId: { type: 'string', format: 'uuid', example: '9f8b1f16-bf25-4b82-b0c5-3a9d94db1fcb' },
                appointmentId: { type: 'string', format: 'uuid', example: 'b2cbb7a0-5f9f-4d47-82f6-94a9492b19c7' },
                name: { type: 'string', enum: ['BOTOX', 'PREENCHIMENTO', 'LAVIEEN'], example: 'BOTOX' },
                product: { type: 'string', example: 'Botox Premium', nullable: true },
                region: { type: 'string', example: 'Forehead' },
                value: { type: 'number', example: 1200.50 },
            },
            required: ['userId', 'appointmentId', 'name', 'region', 'value'],
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Procedure created successfully',
        schema: {
            example: {
                procedure: {
                    id: 'uuid',
                    userId: 'uuid',
                    appointmentId: 'uuid',
                    name: 'BOTOX',
                    product: 'Botox Premium',
                    region: 'Forehead',
                    value: 1200.50,
                    createdAt: '2025-08-07T14:30:00Z'
                }
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad Request - Invalid input data',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Not Found - User or Appointment does not exist',
        schema: {
            examples: {
                userNotFound: {
                    value: { message: 'User with the specified ID does not exist.' }
                },
                appointmentNotFound: {
                    value: { message: 'Appointment with the specified ID does not exist.' }
                }
            }
        }
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RegisterProcedureController.prototype, "handle", null);
exports.RegisterProcedureController = RegisterProcedureController = __decorate([
    (0, common_1.Controller)('/procedures'),
    (0, swagger_1.ApiTags)('Procedures'),
    __metadata("design:paramtypes", [register_procedure_1.RegisterProcedureUseCase])
], RegisterProcedureController);
//# sourceMappingURL=register-procedure.js.map