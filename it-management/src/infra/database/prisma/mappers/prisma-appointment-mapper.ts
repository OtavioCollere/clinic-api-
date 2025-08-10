import { Appointment as PrismaAppointment, type Prisma } from '@prisma/client'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'
import { Appointment } from 'src/domain/management/enterprise/entities/appointment'

export class PrismaAppointmentMapper {
  static toDomain(raw: PrismaAppointment): Appointment {
    return Appointment.create(
      {
        userId: new UniqueEntityID(raw.userId),
        name: raw.name,
        description: raw.description ?? undefined,
        duration: raw.duration,
        status: raw.status as 'PENDING' | 'CONFIRMED' | 'CANCELED',
        dateHour: raw.dateHour,
        updatedBy: raw.updatedBy ?? undefined,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id)
    )
  }

  static toPrisma(appointment: Appointment): Prisma.AppointmentUncheckedCreateInput {
    return {
      id: appointment.id.toString(),
      userId: appointment.userId.toString(),
      name: appointment.name,
      description: appointment.description,
      duration: appointment.duration,
      status: appointment.status,
      dateHour: appointment.dateHour,
      updatedBy: appointment.updatedBy ?? null,
      createdAt: appointment.createdAt,
      updatedAt: appointment.updatedAt,
    }
  }
}
