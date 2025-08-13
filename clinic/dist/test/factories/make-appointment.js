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
exports.AppointmentFactory = void 0;
exports.MakeAppointment = MakeAppointment;
const common_1 = require("@nestjs/common");
const unique_entity_id_1 = require("../../src/core/entities/unique-entity-id");
const appointment_1 = require("../../src/domain/management/enterprise/entities/appointment");
const prisma_appointment_mapper_1 = require("../../src/infra/database/prisma/mappers/prisma-appointment-mapper");
const prisma_service_1 = require("../../src/infra/database/prisma/prisma.service");
function MakeAppointment(override, id) {
    const appointment = appointment_1.Appointment.create({
        userId: new unique_entity_id_1.UniqueEntityID(),
        name: 'Agendamento 1',
        dateHour: new Date(),
        duration: 60,
        status: 'PENDING',
        description: 'none',
        ...override
    }, new unique_entity_id_1.UniqueEntityID(id));
    return appointment;
}
let AppointmentFactory = class AppointmentFactory {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async makePrismaAppointment(data = {}) {
        const appointment = MakeAppointment(data);
        await this.prismaService.appointment.create({
            data: prisma_appointment_mapper_1.PrismaAppointmentMapper.toPrisma(appointment)
        });
        return appointment;
    }
};
exports.AppointmentFactory = AppointmentFactory;
exports.AppointmentFactory = AppointmentFactory = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AppointmentFactory);
//# sourceMappingURL=make-appointment.js.map