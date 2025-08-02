"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaAppointmentMapper = void 0;
const unique_entity_id_1 = require("../../../../core/entities/unique-entity-id");
const appointment_1 = require("../../../../domain/management/enterprise/entities/appointment");
class PrismaAppointmentMapper {
    static toDomain(raw) {
        return appointment_1.Appointment.create({
            userId: new unique_entity_id_1.UniqueEntityID(raw.userId),
            name: raw.name,
            description: raw.description ?? undefined,
            duration: raw.duration,
            status: raw.status,
            dateHour: raw.dateHour,
            updatedBy: raw.updatedBy ?? undefined,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        }, new unique_entity_id_1.UniqueEntityID(raw.id));
    }
    static toPrisma(appointment) {
        return {
            id: appointment.id.toString(),
            userId: appointment.userId.toString(),
            name: appointment.name,
            description: appointment.description ?? null,
            duration: appointment.duration,
            status: appointment.status,
            dateHour: appointment.dateHour,
            updatedBy: appointment.updatedBy ?? null,
            createdAt: appointment.createdAt,
            updatedAt: appointment.updatedAt,
        };
    }
}
exports.PrismaAppointmentMapper = PrismaAppointmentMapper;
//# sourceMappingURL=prisma-appointment-mapper.js.map