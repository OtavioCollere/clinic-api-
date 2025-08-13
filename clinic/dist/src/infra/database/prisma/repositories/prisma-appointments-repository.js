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
exports.PrismaAppointmentRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const prisma_appointment_mapper_1 = require("../mappers/prisma-appointment-mapper");
let PrismaAppointmentRepository = class PrismaAppointmentRepository {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async isPendingStatus(id) {
        const appointment = await this.prismaService.appointment.findUnique({
            where: { id }
        });
        if (appointment.status !== 'PENDING') {
            return false;
        }
        else {
            return true;
        }
    }
    async create(appointment) {
        const data = prisma_appointment_mapper_1.PrismaAppointmentMapper.toPrisma(appointment);
        await this.prismaService.appointment.create({
            data
        });
        return appointment;
    }
    async findById(id) {
        const appointment = await this.prismaService.appointment.findUnique({
            where: { id }
        });
        if (!appointment)
            return null;
        return prisma_appointment_mapper_1.PrismaAppointmentMapper.toDomain(appointment);
    }
    async findByUserId(userId) {
        const appointments = await this.prismaService.appointment.findMany({
            where: { userId }
        });
        return appointments.map(prisma_appointment_mapper_1.PrismaAppointmentMapper.toDomain);
    }
    async findByDateHour(dateHour) {
        const appointment = await this.prismaService.appointment.findFirst({
            where: { dateHour }
        });
        if (!appointment)
            return null;
        return prisma_appointment_mapper_1.PrismaAppointmentMapper.toDomain(appointment);
    }
    async findByInterval({ startHour, endHour }) {
        const appointment = await this.prismaService.appointment.findFirst({
            where: {
                dateHour: {
                    gte: startHour,
                    lte: endHour
                }
            }
        });
        if (!appointment)
            return null;
        return prisma_appointment_mapper_1.PrismaAppointmentMapper.toDomain(appointment);
    }
    async save(appointment) {
        const data = prisma_appointment_mapper_1.PrismaAppointmentMapper.toPrisma(appointment);
        await this.prismaService.appointment.update({
            data,
            where: {
                id: data.id
            }
        });
        return appointment;
    }
    async delete(id) {
        await this.prismaService.appointment.delete({
            where: { id }
        });
    }
    async findAppointmentsByUserId(appointmentId) {
        return await this.prismaService.appointment.findMany({
            where: { userId: appointmentId }
        }).then(appointments => appointments.map(prisma_appointment_mapper_1.PrismaAppointmentMapper.toDomain));
    }
    async getAll({ query, page }) {
        const PAGE_SIZE = 20;
        const appointments = await this.prismaService.appointment.findMany({
            where: query
                ? {
                    OR: [
                        { name: { contains: query, mode: 'insensitive' } },
                        { description: { contains: query, mode: 'insensitive' } },
                        { status: { contains: query, mode: 'insensitive' } },
                    ],
                }
                : undefined,
            take: PAGE_SIZE,
            skip: (page - 1) * PAGE_SIZE,
            orderBy: { createdAt: 'desc' },
        });
        return appointments.map(prisma_appointment_mapper_1.PrismaAppointmentMapper.toDomain);
    }
};
exports.PrismaAppointmentRepository = PrismaAppointmentRepository;
exports.PrismaAppointmentRepository = PrismaAppointmentRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaAppointmentRepository);
//# sourceMappingURL=prisma-appointments-repository.js.map