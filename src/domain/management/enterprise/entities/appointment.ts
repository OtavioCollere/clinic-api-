import { Entity } from "src/core/entities/entity"
import { UniqueEntityID } from "src/core/entities/unique-entity-id"
import type { Optional } from "src/core/types/optional"

export interface AppointmentProps{
  userId : UniqueEntityID
  name : string
  description? : string
  duration : number // somente de 30 em 30 min
  status? : 'PENDING' | 'CONFIRMED' | 'CANCELED';
  dateHour : Date;
  updatedBy? : string
  createdAt? : Date
  updatedAt? : Date;
}

export class Appointment extends Entity<AppointmentProps> {

  static create(props : Optional<AppointmentProps, 'description' | 'updatedBy' | 'createdAt' | 'updatedAt' | 'status'>, id? : UniqueEntityID) {
    const appointment = new Appointment({
      status : 'PENDING',
      createdAt : props.createdAt ?? new Date(),
      ...props
    }, id)

    return appointment
  }

  public isPendingStatus() : boolean {
    return this.props.status === 'PENDING';
  }

  confirmAppointment() {
    this.props.status = 'CONFIRMED';
  }

  cancelAppointment() {
    this.props.status = 'CANCELED';
  }

  get userId() {
    return this.props.userId
  }


  set userId(value : UniqueEntityID) {
    this.props.userId = value;
    this.touch();
  }

  get name(): string {
    return this.props.name;
  }

  set name(value: string) {
    this.props.name = value;
    this.touch();
  }

  get description(): string | undefined {
    return this.props.description;
  }

  set description(value: string | undefined) {
    this.props.description = value;
    this.touch();
  }

  get duration(): number {
    return this.props.duration;
  }

  set duration(value: number) {
    this.props.duration = value;
    this.touch();
  }

  get status(): 'PENDING' | 'CONFIRMED' | 'CANCELED' {
    return this.props.status;
  }

  set status(value: 'PENDING' | 'CONFIRMED' | 'CANCELED') {
    this.props.status = value;
    this.touch();
  }

  get dateHour(): Date {
    return this.props.dateHour;
  }

  set dateHour(value: Date) {
    this.props.dateHour = value;
    this.touch();
  }

  get updatedBy(): string | undefined {
    return this.props.updatedBy;
  }

  set updatedBy(value: string | undefined) {
    this.props.updatedBy = value;
    this.touch();
  }

  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }

  set createdAt(value: Date | undefined) {
    this.props.createdAt = value;
    this.touch();
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  set updatedAt(value: Date | undefined) {
    this.props.updatedAt = value;
    this.touch();
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }
}