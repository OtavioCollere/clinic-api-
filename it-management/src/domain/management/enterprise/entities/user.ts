import { Entity } from "src/core/entities/entity";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import type { Optional } from "src/core/types/optional";

export interface UserProps{
  name : string;
  email : string
  sector : string
  password : string
  updatedAt? : Date
  createdAt? : Date
}

export class User extends Entity<UserProps>{
  private touch(): void {
    this.props.updatedAt = new Date();
  }

  get name(): string {
    return this.props.name;
  }

  set name(value: string) {
    this.props.name = value;
    this.touch();
  }

  get email(): string {
    return this.props.email;
  }

  set email(value: string) {
    this.props.email = value;
    this.touch();
  }

  get sector(): string {
    return this.props.sector;
  }

  set sector(value: string) {
    this.props.sector = value;
    this.touch();
  }

  get password(): string {
    return this.props.password;
  }

  set password(value: string) {
    this.props.password = value;
    this.touch();
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }

  static create(props : Optional<UserProps, 'updatedAt' | 'createdAt'>, id?: UniqueEntityID)
  {
    const user = new User({
      createdAt : props.updatedAt ?? new Date(),
      ...props
    }, id)
  
    return user
  }
}