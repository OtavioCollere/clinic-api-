import { Injectable } from "@nestjs/common";
import { makeLeft, makeRight, type Either } from "src/core/either/either";
import { AppointmentNotFoundError } from "src/core/errors/appointment-not-found-error";
import { UserNotFoundError } from "src/core/errors/user-not-found-error";
import { Procedure } from "src/domain/management/enterprise/entities/procedure";
import { ProceduresRepository } from "../../repositories/procedures-repository";
import { UsersRepository } from "../../repositories/users-repository";
import { AppointmentsRepository } from "../../repositories/appointment-repository";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { ProcedureNotFoundError } from "src/core/errors/procedure-not-found-error";

interface EditProcedureUseCaseRequest{
  procedureId : string
  updatedBy : string
  userId? : string
  appointmentId? : string
  name? : 'BOTOX' | 'PREENCHIMENTO' | 'LAVIEEN'
  product? : string
  region? : string
  value? : number
}

type EditProcedureUseCaseResponse = Either<
  ProcedureNotFoundError | AppointmentNotFoundError | UserNotFoundError,
  {
    procedure : Procedure
  }
  >

@Injectable()
export class EditProcedureUseCase{

  constructor(
    private proceduresRepository : ProceduresRepository,
    private usersRepository : UsersRepository,
    private appointmentsRepository: AppointmentsRepository
  ) {}

  async execute({
    procedureId,
    updatedBy,              // <- incluir
    userId,
    appointmentId,
    name,
    product,
    region,
    value
  }: EditProcedureUseCaseRequest): Promise<EditProcedureUseCaseResponse> {
  
    const procedure = await this.proceduresRepository.findById(procedureId);
    if (!procedure) return makeLeft(new ProcedureNotFoundError());
  
    // (opcional) verificar se quem atualiza existe
    if (updatedBy) {
      const updater = await this.usersRepository.findById(updatedBy);
      if (!updater) return makeLeft(new UserNotFoundError());
    }
  
    if (userId) {
      const userExists = await this.usersRepository.findById(userId);
      if (!userExists) return makeLeft(new UserNotFoundError());
      procedure.userId = new UniqueEntityID(userId);
    }
  
    if (appointmentId) {
      const appointmentExists = await this.appointmentsRepository.findById(appointmentId);
      if (!appointmentExists) return makeLeft(new AppointmentNotFoundError());
      procedure.appointmentId = new UniqueEntityID(appointmentId);
    }
  
    if (name) procedure.name = name;
    if (typeof value !== "undefined") procedure.value = value;
    if (typeof product !== "undefined") procedure.product = product;
    if (typeof region !== "undefined") procedure.region = region;
  
    // (opcional) auditar
    // procedure.updatedBy = new UniqueEntityID(updatedBy);
    // procedure.updatedAt = new Date();
  
    await this.proceduresRepository.save(procedure);
    return makeRight({ procedure });
  }
  
}