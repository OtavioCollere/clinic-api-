import { Injectable } from "@nestjs/common";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { Appointment, type AppointmentProps } from "src/domain/management/enterprise/entities/appointment";
import { PrismaAppointmentMapper } from "src/infra/database/prisma/mappers/prisma-appointment-mapper";
import { PrismaService } from "src/infra/database/prisma/prisma.service";

export function MakeAppointment(override : Partial<AppointmentProps>, id? : string) {
  const appointment = Appointment.create({
    userId : new UniqueEntityID(),
    name : 'Agendamento 1',
    dateHour : new Date(),
    duration : 60,
    status : 'PENDING',
    description : 'none',
    ...override
  }, new UniqueEntityID(id))

  return appointment
}


@Injectable()
export class AppointmentFactory{
  constructor(private prismaService : PrismaService) {} 

  async makePrismaAppointment(data : Partial<AppointmentProps> = {}) : Promise<Appointment> {

    const appointment = MakeAppointment(data)

    await this.prismaService.appointment.create({
      data: PrismaAppointmentMapper.toPrisma(appointment)
    })

    return appointment
  }
}