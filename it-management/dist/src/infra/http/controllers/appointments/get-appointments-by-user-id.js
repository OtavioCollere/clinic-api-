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
exports.GetAppointmentsByUserIdController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const zod_1 = require("zod");
const zod_validation_pipe_1 = require("../../pipes/zod-validation-pipe");
const either_1 = require("../../../../core/either/either");
const user_not_found_error_1 = require("../../../../core/errors/user-not-found-error");
const getAppointmentsByUserIdParamSchema = zod_1.default.object({
    userId: zod_1.default.string().uuid(),
});
let GetAppointmentsByUserIdController = class GetAppointmentsByUserIdController {
    constructor(getAppointmentsByUserId) {
        this.getAppointmentsByUserId = getAppointmentsByUserId;
    }
    async handle(params) {
        const userId = params.userId;
        const result = await this.getAppointmentsByUserId.execute({
            userId
        });
        if ((0, either_1.isLeft)(result)) {
            const error = (0, either_1.unwrapEither)(result);
            switch (error.constructor) {
                case user_not_found_error_1.UserNotFoundError:
                    throw new common_1.NotFoundException(error.message);
                default:
                    throw new common_1.BadRequestException(error.message);
            }
        }
        const appointments = (0, either_1.unwrapEither)(result);
        return {
            appointments
        };
    }
};
exports.GetAppointmentsByUserIdController = GetAppointmentsByUserIdController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get appointments by user ID' }),
    (0, common_1.Get)(':userId'),
    (0, common_1.HttpCode)(200),
    (0, common_1.UsePipes)(new zod_validation_pipe_1.ZodValidationPipe(getAppointmentsByUserIdParamSchema)),
    (0, swagger_1.ApiParam)({
        description: 'The ID of the user whose appointments you want to retrieve',
        name: 'userId',
        type: String,
        required: true,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Appointments retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                appointments: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string', format: 'uuid' },
                            userId: { type: 'string', format: 'uuid' },
                            dateHour: { type: 'string', format: 'date-time' },
                            status: { type: 'string' },
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'User not found error ( NotFoundException )',
        schema: {
            example: { message: 'Invalid input data.' },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Bad Request - Validation or other issues',
    }),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GetAppointmentsByUserIdController.prototype, "handle", null);
exports.GetAppointmentsByUserIdController = GetAppointmentsByUserIdController = __decorate([
    (0, common_1.Controller)('appointments'),
    (0, swagger_1.ApiTags)('Appointments'),
    __metadata("design:paramtypes", [Function])
], GetAppointmentsByUserIdController);
//# sourceMappingURL=get-appointments-by-user-id.js.map