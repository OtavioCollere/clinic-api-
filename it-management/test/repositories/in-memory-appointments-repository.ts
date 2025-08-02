import type { AppointmentsRepository } from "src/domain/management/application/repositories/appointment-repository";
import type { Appointment } from "src/domain/management/enterprise/entities/appointment";

export class InMemoryAppointmentsRepository implements AppointmentsRepository{
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
    const appointment = this.items.filter((item) => item.userId === userId)

    return appointment
  }

  async findByDateHour(dateHour: Date): Promise<Appointment | null> {
    throw Error();
  }

  async findByInterval({ startHour, endHour }: { startHour: Date; endHour: Date; }): Promise<Appointment | null> {
    const appointment = this.items.find((item) => {
      return item.dateHour >= startHour && item.dateHour <= endHour;
    })

    if (!appointment) return null

    return appointment
  }
  
} 