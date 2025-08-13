"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma/prisma.service");
const users_repository_1 = require("../../domain/management/application/repositories/users-repository");
const prisma_users_repository_1 = require("./prisma/repositories/prisma-users-repository");
const prisma_appointments_repository_1 = require("./prisma/repositories/prisma-appointments-repository");
const appointment_repository_1 = require("../../domain/management/application/repositories/appointment-repository");
const procedures_repository_1 = require("../../domain/management/application/repositories/procedures-repository");
const prisma_procedures_repository_1 = require("./prisma/repositories/prisma-procedures-repository");
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Module)({
        providers: [
            prisma_service_1.PrismaService,
            { provide: users_repository_1.UsersRepository, useClass: prisma_users_repository_1.PrismaUsersRepository },
            { provide: appointment_repository_1.AppointmentsRepository, useClass: prisma_appointments_repository_1.PrismaAppointmentRepository },
            { provide: procedures_repository_1.ProceduresRepository, useClass: prisma_procedures_repository_1.PrismaProceduresRepository }
        ],
        exports: [
            prisma_service_1.PrismaService,
            users_repository_1.UsersRepository,
            appointment_repository_1.AppointmentsRepository,
            procedures_repository_1.ProceduresRepository
        ]
    })
], DatabaseModule);
//# sourceMappingURL=database.module.js.map