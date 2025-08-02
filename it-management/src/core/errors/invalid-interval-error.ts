import type { Appointment } from "src/domain/management/enterprise/entities/appointment";

interface InvalidIntervalErrorProps {
  existentAppointment: Appointment;
  startHour : Date
  endHour : Date;
}

export class InvalidIntervalError extends Error {
  constructor({existentAppointment, startHour, endHour} : InvalidIntervalErrorProps){
    super(
      `Invalid interval error: there is already an appointment at ${existentAppointment.dateHour.toISOString()} that conflicts with interval ${startHour.toISOString()} - ${endHour.toISOString()}`
    ); 
  }
}