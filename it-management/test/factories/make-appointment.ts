import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { Appointment, type AppointmentProps } from "src/domain/management/enterprise/entities/appointment";

export function MakeAppointment(override : Partial<AppointmentProps>, id? : string) {
  const appointment = Appointment.create({
    name : 'Agendamento 1',
    dateHour : new Date(),
    duration : 60,
    userId : new UniqueEntityID(),
    ...override
  }, new UniqueEntityID(id))

  return appointment
}