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
exports.EditProcedureController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const zod_1 = require("zod");
const zod_validation_pipe_1 = require("../../pipes/zod-validation-pipe");
const either_1 = require("../../../../core/either/either");
const edit_procedure_1 = require("../../../../domain/management/application/use-cases/procedures/edit-procedure");
const appointment_not_found_error_1 = require("../../../../core/errors/appointment-not-found-error");
const user_not_found_error_1 = require("../../../../core/errors/user-not-found-error");
const procedure_not_found_error_1 = require("../../../../core/errors/procedure-not-found-error");
const editProcedureBodySchema = zod_1.default.object({
    procedureId: zod_1.default.string().uuid(),
    updatedBy: zod_1.default.string().uuid(),
    userId: zod_1.default.string().uuid().optional(),
    appointmentId: zod_1.default.string().uuid().optional(),
    name: zod_1.default.enum(['BOTOX', 'PREENCHIMENTO', 'LAVIEEN']).optional(),
    product: zod_1.default.string().optional(),
    region: zod_1.default.string().optional(),
    value: zod_1.default.number().optional(),
});
let EditProcedureController = class EditProcedureController {
    constructor(editProcedure) {
        this.editProcedure = editProcedure;
    }
    async handle(body) {
        const { procedureId, updatedBy, userId, appointmentId, name, product, region, value } = body;
        const result = await this.editProcedure.execute({
            procedureId,
            updatedBy,
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
                case procedure_not_found_error_1.ProcedureNotFoundError:
                    throw new common_1.NotFoundException(error.message);
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
exports.EditProcedureController = EditProcedureController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Edit a procedure" }),
    (0, common_1.Patch)(),
    (0, common_1.HttpCode)(200),
    (0, common_1.UsePipes)(new zod_validation_pipe_1.ZodValidationPipe(editProcedureBodySchema)),
    (0, swagger_1.ApiBody)({
        description: "Fields to update",
        schema: {
            type: 'object',
            properties: {
                updatedBy: { type: 'string', format: 'uuid', example: 'c7f8d2a1-5e3b-4a9f-8c0d-1e2f3a4b5c6d', nullable: true },
                userId: { type: 'string', format: 'uuid', example: '9f8b1f16-bf25-4b82-b0c5-3a9d94db1fcb', nullable: true },
                appointmentId: { type: 'string', format: 'uuid', example: 'b2cbb7a0-5f9f-4d47-82f6-94a9492b19c7', nullable: true },
                name: { type: 'string', enum: ['BOTOX', 'PREENCHIMENTO', 'LAVIEEN'], example: 'BOTOX', nullable: true },
                product: { type: 'string', example: 'Botox Premium', nullable: true },
                region: { type: 'string', example: 'Forehead', nullable: true },
                value: { type: 'number', example: 1350.00, nullable: true },
            },
            required: [],
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Procedure updated successfully',
        schema: {
            example: {
                procedure: {
                    id: 'uuid',
                    userId: 'uuid',
                    appointmentId: 'uuid',
                    name: 'BOTOX',
                    product: 'Botox Premium',
                    region: 'Forehead',
                    value: 1350.00,
                    updatedAt: '2025-08-13T12:00:00Z'
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request - Invalid input data' }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Not Found',
        schema: {
            examples: {
                procedureNotFound: { value: { message: 'Procedure not found.' } },
                userNotFound: { value: { message: 'User with the specified ID does not exist.' } },
                appointmentNotFound: { value: { message: 'Appointment with the specified ID does not exist.' } },
            }
        }
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EditProcedureController.prototype, "handle", null);
exports.EditProcedureController = EditProcedureController = __decorate([
    (0, swagger_1.ApiTags)('Procedures'),
    (0, common_1.Controller)('/procedures'),
    __metadata("design:paramtypes", [edit_procedure_1.EditProcedureUseCase])
], EditProcedureController);
//# sourceMappingURL=edit-procedure.js.map