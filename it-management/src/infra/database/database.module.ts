import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { UsersRepository } from "src/domain/management/application/repositories/users-repository";
import { PrismaUsersRepository } from "./prisma/repositories/prisma-users-repository";
import { PrismaAppointmentRepository } from "./prisma/repositories/prisma-appointments-repository";
import { AppointmentsRepository } from "src/domain/management/application/repositories/appointment-repository";

@Module({
  providers : [
    PrismaService,
    {provide : UsersRepository, useClass : PrismaUsersRepository},
    {provide : AppointmentsRepository, useClass : PrismaAppointmentRepository}
  ],
  exports : [
    PrismaService,
    
    UsersRepository,
    AppointmentsRepository

  ]
})
export class DatabaseModule{}