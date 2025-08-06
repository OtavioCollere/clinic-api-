import type { AppointmentsRepository } from "src/domain/management/application/repositories/appointment-repository";
import type { Appointment } from "src/domain/management/enterprise/entities/appointment";

export class InMemoryAppointmentsRepository implements AppointmentsRepository{
  isPendingStatus(id: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  public items : Appointment[] = []

  async create(appointment: Appointment): Promise<Appointment> {
    this.items.push(appointment)

    return appointment
  }

  async findById(id: string): Promise<Appointment | null> {
    const appointment = this.items.find((item) => item.id.toString() === id)
    
    if(!appointment) return null
    
    return appointment
  }

  async findByUserId(userId: string): Promise<Appointment[]> {
    const appointment = this.items.filter((item) => item.userId.toString() === userId)

    return appointment
  }

  async findByDateHour(dateHour: Date): Promise<Appointment | null> {
    throw Error();
  }

  async save(appointment: Appointment): Promise<Appointment> {
    const index = this.items.findIndex(u => u.id.toString() === appointment.id.toString());
    if (index !== -1) {
      this.items[index] = appointment;
    }
    return appointment;
  }

  async findByInterval({ startHour, endHour }: { startHour: Date; endHour: Date; }): Promise<Appointment | null> {
    const appointment = this.items.find((item) => {
      return item.dateHour >= startHour && item.dateHour <= endHour;
    })

    if (!appointment) return null

    return appointment
  }

  async findAppointmentsByUserId(appointmentId: string) {
    const appointments = this.items.filter((item) => item.userId.toString() === appointmentId);

    return appointments;
  }

  async getAll(): Promise<Appointment[]> {
    return this.items;
  }
  
} 