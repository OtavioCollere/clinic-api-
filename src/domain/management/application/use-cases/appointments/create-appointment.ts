import { Injectable } from "@nestjs/common";
import { AppointmentsRepository } from "../../repositories/appointment-repository";
import { UsersRepository } from "../../repositories/users-repository";
import { makeLeft, makeRight, type Either } from "src/core/either/either";
import { Appointment } from "src/domain/management/enterprise/entities/appointment";
import { UserNotFoundError } from "src/core/errors/user-not-found-error";
import { InvalidIntervalError } from "src/core/errors/invalid-interval-error";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";

// Documentar endpoint depois
/* 
  - o repositorio local que verifica os intervalos é a fonte de verdade
  - a integração com google agenda, será somente para salvar na agenda do USUÁRIO
    - por tal motivo o google agenda apenas salva a data que JA FOI verificada na agenda da DOUTURA 
*/

interface CreateAppointmentRequest {
  userId : string
  name : string
  description?: string
  duration: number
  dateHour: Date
}

type CreateAppointmentResponse = Either<
UserNotFoundError | InvalidIntervalError, 
{
  appointment : Appointment
}
>

@Injectable()
export class CreateAppointmentUseCase{

  constructor(
    private appointmentsRepository: AppointmentsRepository,
    private usersRepository : UsersRepository 
  ) {}


  async execute({userId, name, description, duration, dateHour} : CreateAppointmentRequest) : Promise<CreateAppointmentResponse> {
    
    const userExists = await this.usersRepository.findById(userId);

    if (!userExists) {
      return makeLeft(new UserNotFoundError());
    }

    const startHour = new Date(dateHour.getTime());
    const endHour = new Date(dateHour.getTime() + duration * 60 * 1000);

    // For create an appointment, there should not be any other in the time interval
    const existentAppointment = await this.appointmentsRepository.findByInterval({startHour, endHour})
    
    if(existentAppointment) {
      return makeLeft(new InvalidIntervalError({
        existentAppointment,
        startHour,
        endHour
      }))
    }

    const appointment = Appointment.create({
      userId : new UniqueEntityID(userId),
      name,
      description,
      duration,
      dateHour
    }) 

    await this.appointmentsRepository.create(appointment)

    return makeRight({
      appointment
    })

  }

}