import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { UsersRepository } from "src/domain/management/application/repositories/users-repository";
import { PrismaUsersRepository } from "./prisma/repositories/prisma-users-repository";
import { PrismaAppointmentRepository } from "./prisma/repositories/prisma-appointments-repository";
import { AppointmentsRepository } from "src/domain/management/application/repositories/appointment-repository";
import { ProceduresRepository } from "src/domain/management/application/repositories/procedures-repository";
import { PrismaProceduresRepository } from "./prisma/repositories/prisma-procedures-repository";

@Module({
  providers : [
    PrismaService,
    {provide : UsersRepository, useClass : PrismaUsersRepository},
    {provide : AppointmentsRepository, useClass : PrismaAppointmentRepository},
    {provide : ProceduresRepository, useClass : PrismaProceduresRepository}
  ],
  exports : [
    PrismaService,
    
    UsersRepository,
    AppointmentsRepository,
    ProceduresRepository
  ]
})
export class DatabaseModule{}