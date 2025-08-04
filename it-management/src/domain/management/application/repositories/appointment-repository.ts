import { Appointment } from "../../enterprise/entities/appointment";

export abstract class AppointmentsRepository{
  abstract create(appointment: Appointment): Promise<Appointment>;
  abstract findById(id: string): Promise<Appointment | null>;
  abstract findByUserId(userId: string): Promise<Appointment[]>;
  abstract findByDateHour(dateHour: Date): Promise<Appointment | null>;
  abstract findByInterval({startHour, endHour}: {startHour: Date, endHour: Date}): Promise<Appointment | null>;

  // Verifica se o status é PENDING
  abstract isPendingStatus(id : string) : Promise<boolean>
}