export class AppointmentFoundError extends Error {
  constructor(){
    super("Appointment not found");
  }
}