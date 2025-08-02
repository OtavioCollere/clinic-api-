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
exports.RegisterUserController = void 0;
const common_1 = require("@nestjs/common");
const either_1 = require("../../../../core/either/either");
const email_already_exists_error_1 = require("../../../../core/errors/email-already-exists-error");
const register_user_1 = require("../../../../domain/management/application/use-cases/users/register-user");
const public_1 = require("../../../auth/public");
const zod_1 = require("zod");
const zod_validation_pipe_1 = require("../../pipes/zod-validation-pipe");
const registerUserBodySchema = zod_1.default.object({
    name: zod_1.default.string(),
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(6),
    sector: zod_1.default.string()
});
let RegisterUserController = class RegisterUserController {
    constructor(registerUser) {
        this.registerUser = registerUser;
    }
    async handle(body) {
        const { name, email, password, sector } = body;
        const result = await this.registerUser.execute({
            name,
            email,
            password,
            sector
        });
        if ((0, either_1.isLeft)(result)) {
            const error = (0, either_1.unwrapEither)(result);
            switch (error.constructor) {
                case email_already_exists_error_1.EmailAlreadyExistsError:
                    throw new common_1.ConflictException(error.message);
                default:
                    throw new common_1.BadRequestException();
            }
        }
        const user = (0, either_1.unwrapEither)(result).user;
        return {
            user: {
                id: user.id.toString()
            }
        };
    }
};
exports.RegisterUserController = RegisterUserController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(201),
    (0, common_1.UsePipes)(new zod_validation_pipe_1.ZodValidationPipe(registerUserBodySchema)),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RegisterUserController.prototype, "handle", null);
exports.RegisterUserController = RegisterUserController = __decorate([
    (0, common_1.Controller)('/users'),
    (0, public_1.Public)(),
    __metadata("design:paramtypes", [register_user_1.RegisterUserUseCase])
], RegisterUserController);
//# sourceMappingURL=register-user.js.map