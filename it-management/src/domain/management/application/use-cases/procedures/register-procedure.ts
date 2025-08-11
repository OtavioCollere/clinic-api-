import { Injectable } from "@nestjs/common";
import { makeLeft, makeRight, type Either } from "src/core/either/either";
import { AppointmentNotFoundError } from "src/core/errors/appointment-not-found-error";
import { UserNotFoundError } from "src/core/errors/user-not-found-error";
import { Procedure } from "src/domain/management/enterprise/entities/procedure";
import { ProceduresRepository } from "../../repositories/procedures-repository";
import { UsersRepository } from "../../repositories/users-repository";
import { AppointmentsRepository } from "../../repositories/appointment-repository";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";

interface RegisterProcedureUseCaseRequest{
  userId : string
  appointmentId : string
  name : 'BOTOX' | 'PREENCHIMENTO' | 'LAVIEEN'
  product? : string
  region : string
  value : number
}

type RegisterProcedureUseCaseResponse = Either<
  AppointmentNotFoundError | UserNotFoundError,
  {
    procedure : Procedure
  }
  >

@Injectable()
export class RegisterProcedureUseCase{

  constructor(
    private proceduresRepository : ProceduresRepository,
    private usersRepository : UsersRepository,
    private appointmentsRepository: AppointmentsRepository
  ) {}

  async execute({userId, appointmentId, name, product, region, value} : RegisterProcedureUseCaseRequest) : Promise<RegisterProcedureUseCaseResponse> {

    const userExists = await this.usersRepository.findById(userId);

    if(!userExists) {
      return makeLeft(new UserNotFoundError());
    }

    const appointmentExists = await this.appointmentsRepository.findById(appointmentId);

    if(!appointmentExists) {
      return makeLeft(new AppointmentNotFoundError());
    }

    const procedure = Procedure.create({
      userId : new UniqueEntityID(userId),
      appointmentId : new UniqueEntityID(appointmentId), 
      name,
      product, 
      region, 
      value,
    })

    await this.proceduresRepository.create(procedure)

    return makeRight({
      procedure
    })

  }
}