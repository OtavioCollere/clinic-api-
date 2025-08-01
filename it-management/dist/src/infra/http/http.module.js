"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpModule = void 0;
const common_1 = require("@nestjs/common");
const cryptograph_module_1 = require("../cryptography/cryptograph.module");
const register_user_1 = require("../../domain/management/application/use-cases/users/register-user");
const auth_module_1 = require("../auth/auth.module");
const database_module_1 = require("../database/database.module");
const register_user_2 = require("./controllers/register-user");
const authenticate_user_1 = require("../../domain/management/application/use-cases/users/authenticate-user");
const authenticate_user_2 = require("./controllers/authenticate-user");
let HttpModule = class HttpModule {
};
exports.HttpModule = HttpModule;
exports.HttpModule = HttpModule = __decorate([
    (0, common_1.Module)({
        imports: [cryptograph_module_1.CryptographyModule, auth_module_1.AuthModule, database_module_1.DatabaseModule],
        controllers: [
            register_user_2.RegisterUserController,
            authenticate_user_2.AuthenticateController
        ],
        providers: [
            register_user_1.RegisterUserUseCase,
            authenticate_user_1.AuthenticatheUserUseCase
        ]
    })
], HttpModule);
//# sourceMappingURL=http.module.js.map