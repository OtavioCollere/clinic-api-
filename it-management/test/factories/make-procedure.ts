import { Injectable } from "@nestjs/common";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { Procedure, type ProcedureProps } from "src/domain/management/enterprise/entities/procedure";
import { PrismaProcedureMapper } from "src/infra/database/prisma/mappers/prisma-procedures-mapper";
import { PrismaService } from "src/infra/database/prisma/prisma.service";

export function MakeProcedure(override : Partial<ProcedureProps>, id? : string)
{
  const procedure = Procedure.create({
    userId : new UniqueEntityID(),
    appointmentId : new UniqueEntityID(),
    name : 'BOTOX',
    product : 'PARAGUAY',
    region : 'HEAD',
    value : 1200,
    ...override
  }, new UniqueEntityID(id))

  return procedure
}

@Injectable()
export class ProcedureFactory{
  
  constructor(
    private prismaService : PrismaService 
  ) {}

  async makePrismaProcedure(data : Partial<ProcedureProps> = {}) : Promise<Procedure>{
      const procedure = MakeProcedure(data);

      await this.prismaService.procedure.create({
        data : PrismaProcedureMapper.toPrisma(procedure)
      })

      return procedure
  } 
}