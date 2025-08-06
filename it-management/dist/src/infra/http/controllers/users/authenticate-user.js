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
exports.AuthenticateController = void 0;
const common_1 = require("@nestjs/common");
const authenticate_user_1 = require("../../../../domain/management/application/use-cases/users/authenticate-user");
const zod_1 = require("zod");
const zod_validation_pipe_1 = require("../../pipes/zod-validation-pipe");
const either_1 = require("../../../../core/either/either");
const wrong_credentials_error_1 = require("../../../../core/errors/wrong-credentials-error");
const public_1 = require("../../../auth/public");
const swagger_1 = require("@nestjs/swagger");
const authenticateUserBodySchema = zod_1.default.object({
    email: zod_1.default.string().email(),
    password: zod_1.default.string()
});
let AuthenticateController = class AuthenticateController {
    constructor(authenticateUser) {
        this.authenticateUser = authenticateUser;
    }
    async handle(body) {
        const { email, password } = body;
        const result = await this.authenticateUser.execute({
            email,
            password
        });
        if ((0, either_1.isLeft)(result)) {
            const error = (0, either_1.unwrapEither)(result);
            switch (error.constructor) {
                case wrong_credentials_error_1.WrongCredentialsError:
                    throw new common_1.UnauthorizedException(error.message);
                default:
                    throw new common_1.BadRequestException();
            }
        }
        const accessToken = (0, either_1.unwrapEither)(result).accessToken;
        return {
            access_token: accessToken
        };
    }
};
exports.AuthenticateController = AuthenticateController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Authenticate a user with JWT" }),
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(200),
    (0, common_1.UsePipes)(new zod_validation_pipe_1.ZodValidationPipe(authenticateUserBodySchema)),
    (0, swagger_1.ApiBody)({
        description: "User authentication data",
        schema: {
            type: 'object',
            properties: {
                email: { type: 'string', format: 'email' },
                password: { type: 'string' }
            },
            required: ['email', 'password']
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "User authenticated successfully",
        schema: {
            example: {
                access_token: "41lmiof12i0ofm12ionjfa_otmevjaehnasneska_lcaets"
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Wrong credentials error ( Unathourized exception )',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad Request',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthenticateController.prototype, "handle", null);
exports.AuthenticateController = AuthenticateController = __decorate([
    (0, common_1.Controller)('/session'),
    (0, public_1.Public)(),
    (0, swagger_1.ApiTags)('Auth'),
    __metadata("design:paramtypes", [authenticate_user_1.AuthenticatheUserUseCase])
], AuthenticateController);
//# sourceMappingURL=authenticate-user.js.map