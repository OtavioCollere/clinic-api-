import { Appointment } from "../../enterprise/entities/appointment";
import type { FetchAppointmentsUseCaseIdRequest } from "../use-cases/appointments/fetch-appointments";

export abstract class AppointmentsRepository{
  abstract create(appointment: Appointment): Promise<Appointment>;
  abstract save(appointment: Appointment): Promise<Appointment>;
  abstract findById(id: string): Promise<Appointment | null>;
  abstract findByUserId(userId: string): Promise<Appointment[]>;
  abstract findByDateHour(dateHour: Date): Promise<Appointment | null>;
  abstract findByInterval({startHour, endHour}: {startHour: Date, endHour: Date}): Promise<Appointment | null>;

  // Verifica se o status é PENDING
  abstract isPendingStatus(id : string) : Promise<boolean>

  abstract findAppointmentsByUserId(appointmentId : string) : Promise<Appointment[]>
  abstract getAll({query, page } : FetchAppointmentsUseCaseIdRequest) : Promise<Appointment[]>

}