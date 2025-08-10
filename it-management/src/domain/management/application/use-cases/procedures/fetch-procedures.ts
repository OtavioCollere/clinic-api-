import { Injectable } from "@nestjs/common";
import type { ProceduresRepository } from "../../repositories/procedures-repository";
import { makeRight, type Either } from "src/core/either/either";
import type { Procedure } from "src/domain/management/enterprise/entities/procedure";

interface FetchProceduresUseCaseRequest{
  query? : string
  page? : number
}

type FetchProceduresUseCaseResponse = Either<null, 
{
  procedures : Procedure[]
}
>

@Injectable()
export class FetchProceduresUseCase{
  constructor(
    private proceduresRepository : ProceduresRepository
  ) {}

  async execute({query, page} : FetchProceduresUseCaseRequest) : Promise<FetchProceduresUseCaseResponse> {

    const procedures = await this.proceduresRepository.getAll({query, page})

    return makeRight({
      procedures
    })

  }
}