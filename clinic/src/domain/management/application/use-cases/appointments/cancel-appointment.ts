import { Injectable } from "@nestjs/common";
import { AppointmentsRepository } from "../../repositories/appointment-repository";
import { UsersRepository } from "../../repositories/users-repository";
import { Either, makeLeft, makeRight } from "src/core/either/either";
import { AppointmentNotFoundError } from "src/core/errors/appointment-not-found-error";
import { UserNotFoundError } from "src/core/errors/user-not-found-error";
import { Appointment } from "src/domain/management/enterprise/entities/appointment";

interface CancelAppointmentUseCaseRequest {
  appointmentId: string;
  updatedBy: string;
}

type CancelAppointmentUseCaseResponse = Either<
  AppointmentNotFoundError | UserNotFoundError,
  {
    appointment: Appointment;
  }
>;

@Injectable()
export class CancelAppointmentUseCase {
  constructor(
    private appointmentsRepository: AppointmentsRepository,
    private usersRepository: UsersRepository
  ) {}

  async execute({
    appointmentId,
    updatedBy,
  }: CancelAppointmentUseCaseRequest): Promise<CancelAppointmentUseCaseResponse> {
    const appointment = await this.appointmentsRepository.findById(appointmentId);

    if (!appointment) {
      return makeLeft(new AppointmentNotFoundError());
    }

    const userExists = await this.usersRepository.findById(updatedBy);

    if (!userExists) {
      return makeLeft(new UserNotFoundError());
    }

    appointment.cancelAppointment();

    await this.appointmentsRepository.save(appointment);

    return makeRight({
      appointment,
    });
  }
}
