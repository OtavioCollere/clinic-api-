import { Injectable } from "@nestjs/common";
import { ProceduresRepository } from "../../repositories/procedures-repository";
import { makeRight, type Either } from "src/core/either/either";
import { Procedure } from "src/domain/management/enterprise/entities/procedure";

interface GetProceduresByUserIdUseCaseRequest{
  userId : string
}

type GetProceduresByUserIdUseCaseResponse = Either<null, 
{
  procedures : Procedure[]
}
>

@Injectable()
export class GetProceduresByUserIdUseCase{
  constructor(
    private proceduresRepository : ProceduresRepository
  ) {}

  async execute({userId} : GetProceduresByUserIdUseCaseRequest) : Promise<GetProceduresByUserIdUseCaseResponse> {

    const procedures = await this.proceduresRepository.findByUserId(userId)

    return makeRight({
      procedures
    })

  }
}