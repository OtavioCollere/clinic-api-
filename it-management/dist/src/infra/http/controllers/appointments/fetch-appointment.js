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
exports.FetchAppointmentsController = void 0;
const common_1 = require("@nestjs/common");
const fetch_appointments_1 = require("../../../../domain/management/application/use-cases/appointments/fetch-appointments");
const zod_1 = require("zod");
const zod_validation_pipe_1 = require("../../pipes/zod-validation-pipe");
const either_1 = require("../../../../core/either/either");
const swagger_1 = require("@nestjs/swagger");
const fetchAppointmentsQuerySchema = zod_1.default.object({
    query: zod_1.default.string().optional().default(''),
    page: zod_1.default.coerce.number().int().positive().default(1),
});
let FetchAppointmentsController = class FetchAppointmentsController {
    constructor(fetchAppointments) {
        this.fetchAppointments = fetchAppointments;
    }
    async handle(queryParams) {
        const { query, page } = queryParams;
        const result = await this.fetchAppointments.execute({ query, page });
        if ((0, either_1.isLeft)(result)) {
            throw new common_1.BadRequestException('Failed to fetch appointments');
        }
        return {
            appointments: (0, either_1.unwrapEither)(result).appointments,
        };
    }
};
exports.FetchAppointmentsController = FetchAppointmentsController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(200),
    (0, common_1.UsePipes)(new zod_validation_pipe_1.ZodValidationPipe(fetchAppointmentsQuerySchema)),
    (0, swagger_1.ApiOperation)({ summary: "Fetch appointments with optional search and pagination" }),
    (0, swagger_1.ApiQuery)({
        name: 'query',
        required: false,
        description: 'Search term to filter appointments',
        type: String,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        required: false,
        description: 'Pagination page number',
        type: Number,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of appointments returned successfully',
        schema: {
            example: {
                appointments: [
                    {
                        id: 'uuid',
                        name: 'Agendamento 1',
                        status: 'PENDING',
                        dateHour: '2025-01-01T10:00:00.000Z',
                        duration: 60,
                        userId: 'uuid'
                    }
                ],
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad Request - Invalid input or parameters',
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FetchAppointmentsController.prototype, "handle", null);
exports.FetchAppointmentsController = FetchAppointmentsController = __decorate([
    (0, common_1.Controller)('/appointments'),
    (0, swagger_1.ApiTags)('Appointments'),
    __metadata("design:paramtypes", [fetch_appointments_1.FetchAppointmentsUseCase])
], FetchAppointmentsController);
//# sourceMappingURL=fetch-appointment.js.map