import { Injectable } from "@nestjs/common";
import type { AppointmentsRepository } from "../../repositories/appointment-repository";
import type { UsersRepository } from "../../repositories/users-repository";
import { makeLeft, type Either } from "src/core/either/either";
import type { Appointment } from "src/domain/management/enterprise/entities/appointment";


interface CreateAppointmentRequest {
  userId : string
  name : string
  description?: string
  duration: number
  dateHour: Date
}

type CreateAppointmentResponse = Either<
UserNotFoundError, // arrumar erro
{
  appointment : Appointment
}
>

@Injectable()
export class CreateAppointment{

  constructor(
    private appointmentsRepository: AppointmentsRepository,
    private usersRepository : UsersRepository 
  ) {}


  async execute({userId, name, description, duration, dateHour} : CreateAppointmentRequest) : Promise<CreateAppointmentResponse> {
    
    const userExists = await this.usersRepository.findById(userId);

    if (!userExists) {
      return makeLeft(new UserNotFoundError);
    }

  }

}