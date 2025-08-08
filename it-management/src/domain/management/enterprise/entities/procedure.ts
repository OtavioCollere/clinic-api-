import { Entity } from "src/core/entities/entity";
import type { UniqueEntityID } from "src/core/entities/unique-entity-id";
import type { Optional } from "src/core/types/optional";

export interface ProcedureProps{
  appointmentId : UniqueEntityID
  userId : UniqueEntityID
  name : 'BOTOX' | 'PREENCHIMENTO' | 'LAVIEEN';
  value : number
  product? : string
  region : string
  updatedBy? : string
  updatedAt? : Date
  createdAt?: Date
}

export class Procedure extends Entity<ProcedureProps> {
  set value(value : number) {
    this.props.value = value
  }

  get value() {
    return this.props.value
  }

  get appointmentId() {
    return this.props.appointmentId;
  }

  get userId() {
    return this.props.userId;
  }

  get name(): string {
    return this.props.name;
  }

  set name(value: 'BOTOX' | 'PREENCHIMENTO' | 'LAVIEEN') {
    this.props.name = value;
    this.touch();
  }

  get product(): string | undefined {
    return this.props.product;
  }

  set product(value: string | undefined) {
    this.props.product = value;
    this.touch();
  }

  get region(): string {
    return this.props.region;
  }

  set region(value: string) {
    this.props.region = value;
    this.touch();
  }

  get updatedBy(): string | undefined {
    return this.props.updatedBy;
  }

  set updatedBy(value: string | undefined) {
    this.props.updatedBy = value;
    this.touch();
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  set updatedAt(value: Date | undefined) {
    this.props.updatedAt = value;
  }

  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }

  static create(props : Optional<ProcedureProps, 'createdAt' | 'updatedAt' | 'updatedBy'>, id? : UniqueEntityID) {

    const procedure = new Procedure({
      createdAt : props.createdAt ?? new Date(),
      ...props
    }, id)

    return procedure;
  }
}