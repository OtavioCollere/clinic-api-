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
exports.UserFactory = void 0;
exports.MakeUser = MakeUser;
const faker_1 = require("@faker-js/faker");
const common_1 = require("@nestjs/common");
const unique_entity_id_1 = require("../../src/core/entities/unique-entity-id");
const user_1 = require("../../src/domain/management/enterprise/entities/user");
const prisma_user_mapper_1 = require("../../src/infra/database/prisma/mappers/prisma-user-mapper");
const prisma_service_1 = require("../../src/infra/database/prisma/prisma.service");
function MakeUser(override, id) {
    const user = user_1.User.create({
        name: faker_1.faker.person.fullName(),
        email: faker_1.faker.internet.email(),
        sector: faker_1.faker.commerce.department(),
        password: faker_1.faker.internet.password(),
        ...override
    }, new unique_entity_id_1.UniqueEntityID(id));
    return user;
}
let UserFactory = class UserFactory {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async makePrismaUser(data = {}) {
        const user = MakeUser(data);
        await this.prisma.user.create({
            data: prisma_user_mapper_1.PrismaUserMapper.toPrisma(user)
        });
        return user;
    }
};
exports.UserFactory = UserFactory;
exports.UserFactory = UserFactory = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserFactory);
//# sourceMappingURL=make-user.js.map