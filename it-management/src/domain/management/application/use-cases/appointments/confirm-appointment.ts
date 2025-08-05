import { Injectable } from "@nestjs/common";
import type { AppointmentsRepository } from "../../repositories/appointment-repository";
import type { UsersRepository } from "../../repositories/users-repository";
import { Either, makeLeft, makeRight } from "src/core/either/either";
import { AppointmentFoundError } from "src/core/errors/appointment-not-found-error";
import { UserNotFoundError } from "src/core/errors/user-not-found-error";
import type { Appointment } from "src/domain/management/enterprise/entities/appointment";

interface ConfirmAppointmentUseCaseRequest {
  appointmentId: string
  updatedBy: string 
}

type ConfirmAppointmentUseCaseResponse = Either<
  AppointmentFoundError | UserNotFoundError,
  {
    appointment : Appointment
  }
>

@Injectable()
export class ConfirmAppointmentUseCase{

  constructor(
    private appointmentsRepository : AppointmentsRepository,
    private usersRepository : UsersRepository   
  ) {}

  async execute({ appointmentId, updatedBy } : ConfirmAppointmentUseCaseRequest) : Promise<ConfirmAppointmentUseCaseResponse> {

    const appointment = await this.appointmentsRepository.findById(appointmentId);

    if(!appointment){
      return makeLeft(new AppointmentFoundError());
    }

    const userExists = await this.usersRepository.findById(updatedBy);

    if(!userExists) {
      return makeLeft(new UserNotFoundError());
    }

    appointment.confirmAppointment();

    await this.appointmentsRepository.save(appointment)

    return makeRight({
      appointment
    })

  } 
}