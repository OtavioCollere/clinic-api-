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
exports.FetchProceduresController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const zod_1 = require("zod");
const zod_validation_pipe_1 = require("../../pipes/zod-validation-pipe");
const either_1 = require("../../../../core/either/either");
const fetch_procedures_1 = require("../../../../domain/management/application/use-cases/procedures/fetch-procedures");
const fetchProceduresQuerySchema = zod_1.default.object({
    query: zod_1.default.string().trim().min(1),
    page: zod_1.default.coerce.number().int().min(1).default(1),
});
let FetchProceduresController = class FetchProceduresController {
    constructor(fetchProcedures) {
        this.fetchProcedures = fetchProcedures;
    }
    async handle(queryParams) {
        const { query, page } = queryParams;
        const result = await this.fetchProcedures.execute({ query, page });
        if ((0, either_1.isLeft)(result)) {
            throw new common_1.BadRequestException();
        }
        const { procedures } = (0, either_1.unwrapEither)(result);
        return { procedures };
    }
};
exports.FetchProceduresController = FetchProceduresController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Fetch procedures (search + pagination)" }),
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(200),
    (0, common_1.UsePipes)(new zod_validation_pipe_1.ZodValidationPipe(fetchProceduresQuerySchema)),
    (0, swagger_1.ApiQuery)({ name: "query", type: String, example: "BOTOX", required: true }),
    (0, swagger_1.ApiQuery)({ name: "page", type: Number, example: 1, required: false }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Procedures fetched successfully",
        schema: {
            example: {
                procedures: [
                    {
                        id: "c2db5a3b-7b6c-4c8b-8f1c-1f2e3d4a5b6c",
                        userId: "9f8b1f16-bf25-4b82-b0c5-3a9d94db1fcb",
                        appointmentId: "b2cbb7a0-5f9f-4d47-82f6-94a9492b19c7",
                        name: "BOTOX",
                        product: "Botox Premium",
                        region: "Forehead",
                        value: 1200.5,
                        createdAt: "2025-08-07T14:30:00.000Z",
                    },
                ],
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: "Bad Request - Invalid query params (query/page)",
        schema: { example: { message: "Validation failed for query parameters." } },
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FetchProceduresController.prototype, "handle", null);
exports.FetchProceduresController = FetchProceduresController = __decorate([
    (0, common_1.Controller)("/procedures"),
    (0, swagger_1.ApiTags)("Procedures"),
    __metadata("design:paramtypes", [fetch_procedures_1.FetchProceduresUseCase])
], FetchProceduresController);
//# sourceMappingURL=fetch-procedures.js.map