import { Injectable } from "@nestjs/common";
import { AppointmentsRepository } from "../../repositories/appointment-repository";
import { Either, makeLeft, makeRight } from "src/core/either/either";
import { Appointment } from "src/domain/management/enterprise/entities/appointment";

export interface FetchAppointmentsUseCaseRequest {
  query : string
  page : number
}

type FetchAppointmentsUseCaseResponse = Either<
   null,
  {
    appointments : Appointment[]
  }
>

@Injectable()
export class FetchAppointmentsUseCase{

  constructor(
    private appointmentsRepository : AppointmentsRepository
  ) {}

  async execute({ query, page } : FetchAppointmentsUseCaseRequest) : Promise<FetchAppointmentsUseCaseResponse> {

    const appointments = await this.appointmentsRepository.getAll({query, page});

    return makeRight({
      appointments
    })

  } 
}