

import { Injectable } from "@nestjs/common";
import { AppointmentsRepository } from "../../repositories/appointment-repository";
import { UsersRepository } from "../../repositories/users-repository";
import { makeLeft, makeRight, type Either } from "src/core/either/either";
import { Appointment } from "src/domain/management/enterprise/entities/appointment";
import { UserNotFoundError } from "src/core/errors/user-not-found-error";
import { InvalidIntervalError } from "src/core/errors/invalid-interval-error";
import { StatusIsNotPedingError } from "src/core/errors/status-is-not-peding-error";
import { EditorUserFoundError } from "src/core/errors/editor-user-not-found-error";
import { AppointmentNotFoundError } from "src/core/errors/appointment-not-found-error";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { InvalidDateError } from "src/core/errors/invalid-date-error";

// Documentar endpoint depois
/* 
  - vai reagendar a data, e se quiser vai editar os dados tbm

*/

interface RescheduleAppointmentUseCaseRequest {
  appointmentId : string
  updatedBy : string // id de quem está editando
  userId : string // id do usuario que vai ser atendido
  name? : string
  description?: string
  duration: number
  dateHour: Date
}

type RescheduleAppointmentUseCaseResponse = Either<
UserNotFoundError | InvalidIntervalError, 
{
  appointment : Appointment
}
>

@Injectable()
export class RescheduleAppointmentUseCase{

  constructor(
    private appointmentsRepository: AppointmentsRepository,
    private usersRepository : UsersRepository 
  ) {}


  async execute({appointmentId, updatedBy, userId, name, description, duration, dateHour} : RescheduleAppointmentUseCaseRequest) : Promise<RescheduleAppointmentUseCaseResponse> {

    // primeiro verificar se o agendamento existe
    const appointment = await this.appointmentsRepository.findById(appointmentId)

    if(!appointment) {
      return makeLeft(new AppointmentNotFoundError())
    }
    
    // primeiro verificar se status não é canceled
    const isPendingStatus = appointment.isPendingStatus()

    if(!isPendingStatus) {
      return makeLeft(new StatusIsNotPedingError())
    }

    // verificar se usuario que está editando existe
    const editorUser = await this.usersRepository.findById(updatedBy);

    if (!editorUser) {
      return makeLeft(new EditorUserFoundError());
    }
    
    // verificar se usuário que vai ser atendido existe
    const userExists = await this.usersRepository.findById(userId)

    if (!userExists) {
      return makeLeft(new UserNotFoundError())
    }

    // verificar data/hora não é invalida
    if (dateHour < new Date()) {
      return makeLeft(new InvalidDateError());
    }

    // verificar se o intervalo de hora é valido
    const startHour = new Date(dateHour.getTime());
    const endHour = new Date(dateHour.getTime() + duration * 60 * 1000)

    const existentAppointment = await this.appointmentsRepository.findByInterval({startHour, endHour});

    if(existentAppointment) {
      return makeLeft(new InvalidIntervalError({existentAppointment, startHour, endHour}))
    }

  
    if (userId) {
      const user = await this.usersRepository.findById(userId);

      if(!user) {
        return makeLeft(new UserNotFoundError())
      }

      appointment.userId = new UniqueEntityID(userId);

    }

    appointment.name = name
    appointment.description = description;
    appointment.duration = duration;
    appointment.dateHour = dateHour;
    appointment.updatedBy = updatedBy;
    
    await this.appointmentsRepository.save(appointment);
    
    return makeRight({
      appointment
    })


}}