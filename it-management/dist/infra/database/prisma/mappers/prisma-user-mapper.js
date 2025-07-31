"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaUserMapper = void 0;
const unique_entity_id_1 = require("../../../../core/entities/unique-entity-id");
const user_1 = require("../../../../domain/management/enterprise/entities/user");
class PrismaUserMapper {
    static toDomain(raw) {
        return user_1.User.create({
            name: raw.name,
            email: raw.email,
            sector: raw.sector,
            password: raw.password,
            updatedAt: raw.updatedAt,
            createdAt: raw.createdAt
        }, new unique_entity_id_1.UniqueEntityID(raw.id));
    }
    static toPrisma(user) {
        return {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
            sector: user.sector,
            password: user.password,
            updatedAt: user.updatedAt,
            createdAt: user.createdAt
        };
    }
}
exports.PrismaUserMapper = PrismaUserMapper;
//# sourceMappingURL=prisma-user-mapper.js.map