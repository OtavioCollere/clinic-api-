import type { Appointment } from "../../enterprise/entities/appointment";

export abstract class AppointmentsRepository{
  abstract create(appointment: Appointment): Promise<Appointment>;
  abstract findById(id: string): Promise<Appointment | null>;
  abstract findByUserId(userId: string): Promise<Appointment[]>;
  abstract findByDateHour(dateHour: Date): Promise<Appointment | null>;
}