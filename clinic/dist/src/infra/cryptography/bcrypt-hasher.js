"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BcryptHasher = void 0;
const common_1 = require("@nestjs/common");
const bcryptjs_1 = require("bcryptjs");
let BcryptHasher = class BcryptHasher {
    constructor() {
        this.PASSWORD_SALT_LENGTH = 6;
    }
    async hash(plainText) {
        return (0, bcryptjs_1.hash)(plainText, this.PASSWORD_SALT_LENGTH);
    }
    compare(value, hashedPassword) {
        return (0, bcryptjs_1.compare)(value, hashedPassword);
    }
};
exports.BcryptHasher = BcryptHasher;
exports.BcryptHasher = BcryptHasher = __decorate([
    (0, common_1.Injectable)()
], BcryptHasher);
//# sourceMappingURL=bcrypt-hasher.js.map