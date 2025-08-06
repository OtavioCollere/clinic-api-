import { Injectable } from "@nestjs/common";
import { AppointmentsRepository } from "../../repositories/appointment-repository";
import { UsersRepository } from "../../repositories/users-repository";
import { Either, makeLeft, makeRight } from "src/core/either/either";
import { UserNotFoundError } from "src/core/errors/user-not-found-error";
import { Appointment } from "src/domain/management/enterprise/entities/appointment";

interface GetAppointmentsUseCaseByUserIdRequest {
  userId: string
}

type GetAppointmentsUseCaseByUserIdResponse = Either<
   UserNotFoundError,
  {
    appointments : Appointment[]
  }
>

@Injectable()
export class GetAppointmentsUseCaseByUserId{

  constructor(
    private usersRepository : UsersRepository,
    private appointmentsRepository : AppointmentsRepository
    
  ) {}

  async execute({ userId } : GetAppointmentsUseCaseByUserIdRequest) : Promise<GetAppointmentsUseCaseByUserIdResponse> {

    const userExists = await this.usersRepository.findById(userId);

    if (!userExists) {
      return makeLeft(new UserNotFoundError());
    }

    const appointments = await this.appointmentsRepository.findAppointmentsByUserId(userId);
    
    return makeRight({
      appointments
    })

  } 
}