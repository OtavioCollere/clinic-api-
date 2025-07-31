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
exports.AuthenticatheUserUseCase = exports.AuthenticatheUserUseCaseRequest = void 0;
const common_1 = require("@nestjs/common");
const either_1 = require("../../../../../core/either/either");
const wrong_credentials_error_1 = require("../../../../../core/errors/wrong-credentials-error");
class AuthenticatheUserUseCaseRequest {
}
exports.AuthenticatheUserUseCaseRequest = AuthenticatheUserUseCaseRequest;
let AuthenticatheUserUseCase = class AuthenticatheUserUseCase {
    constructor(usersRepository, hashComparer, encrypter) {
        this.usersRepository = usersRepository;
        this.hashComparer = hashComparer;
        this.encrypter = encrypter;
    }
    async execute({ email, password }) {
        const user = await this.usersRepository.findByEmail(email);
        if (!user) {
            return (0, either_1.makeLeft)(new wrong_credentials_error_1.WrongCredentialsError());
        }
        const isPasswordValid = await this.hashComparer.compare(password, user.password);
        if (!isPasswordValid) {
            return (0, either_1.makeLeft)(new wrong_credentials_error_1.WrongCredentialsError());
        }
        const accessToken = await this.encrypter.encrypt({
            sub: user.id
        });
        return (0, either_1.makeRight)({
            accessToken
        });
    }
};
exports.AuthenticatheUserUseCase = AuthenticatheUserUseCase;
exports.AuthenticatheUserUseCase = AuthenticatheUserUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Function, Function, Function])
], AuthenticatheUserUseCase);
//# sourceMappingURL=authenticate-user.js.map