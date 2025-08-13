"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaProcedureMapper = void 0;
const unique_entity_id_1 = require("../../../../core/entities/unique-entity-id");
const procedure_1 = require("../../../../domain/management/enterprise/entities/procedure");
class PrismaProcedureMapper {
    static toDomain(raw) {
        return procedure_1.Procedure.create({
            appointmentId: new unique_entity_id_1.UniqueEntityID(raw.appointmentId),
            userId: new unique_entity_id_1.UniqueEntityID(raw.userId),
            name: raw.name,
            value: raw.value,
            product: raw.product ?? undefined,
            region: raw.region,
            updatedBy: raw.updatedById ?? undefined,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        }, new unique_entity_id_1.UniqueEntityID(raw.id));
    }
    static toPrisma(procedure) {
        return {
            id: procedure.id.toString(),
            appointmentId: procedure.appointmentId.toString(),
            userId: procedure.userId.toString(),
            name: procedure.name,
            value: procedure.value,
            product: procedure.product ?? null,
            region: procedure.region,
            updatedById: procedure.updatedBy ?? null,
            createdAt: procedure.createdAt,
            updatedAt: procedure.updatedAt,
        };
    }
}
exports.PrismaProcedureMapper = PrismaProcedureMapper;
//# sourceMappingURL=prisma-procedures-mapper.js.map