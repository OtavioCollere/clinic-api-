import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaAppointmentMapper } from "../mappers/prisma-appointment-mapper";
import type { AppointmentsRepository } from "src/domain/management/application/repositories/appointment-repository";
import type { Appointment } from "src/domain/management/enterprise/entities/appointment";

@Injectable()
export class PrismaAppointmentRepository implements AppointmentsRepository {
  constructor(
    private prismaService: PrismaService
  ) {}

  async isPendingStatus(id: string): Promise<boolean> {
    const appointment = await this.prismaService.appointment.findUnique({
      where : { id}
    })

    if (appointment.status !== 'PENDING') {
      return false;
    } else { 
      return true
    }
  }

  async create(appointment: Appointment): Promise<Appointment> {
    const data = PrismaAppointmentMapper.toPrisma(appointment);

    await this.prismaService.appointment.create({
      data
    });

    return appointment;
  }

  async findById(id: string): Promise<Appointment | null> {
    const appointment = await this.prismaService.appointment.findUnique({
      where: { id }
    });

    if (!appointment) return null;

    return PrismaAppointmentMapper.toDomain(appointment);
  }

  async findByUserId(userId: string): Promise<Appointment[]> {
    const appointments = await this.prismaService.appointment.findMany({
      where: { userId }
    });

    return appointments.map(PrismaAppointmentMapper.toDomain);
  }

  async findByDateHour(dateHour: Date): Promise<Appointment | null> {
    const appointment = await this.prismaService.appointment.findFirst({
      where: { dateHour }
    });

    if (!appointment) return null;

    return PrismaAppointmentMapper.toDomain(appointment);
  }

  async findByInterval({
    startHour,
    endHour
  }: { startHour: Date; endHour: Date }): Promise<Appointment | null> {
    const appointment = await this.prismaService.appointment.findFirst({
      where: {
        dateHour: {
          gte: startHour,
          lte: endHour
        }
      }
    });

    if (!appointment) return null;

    return PrismaAppointmentMapper.toDomain(appointment);
  }

  async save(appointment: Appointment): Promise<Appointment> {
    const data = PrismaAppointmentMapper.toPrisma(appointment);

    await this.prismaService.appointment.update({
      data,
      where: {
        id: data.id
      }
    });

    return appointment;
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.appointment.delete({
      where: { id }
    });
  }

  async findAppointmentsByUserId(appointmentId: string): Promise<Appointment[]> {
    return await this.prismaService.appointment.findMany({
      where: { userId: appointmentId }
    }).then(appointments => appointments.map(PrismaAppointmentMapper.toDomain));
  }

  async getAll(): Promise<Appointment[]> {
    
  }


  

}
