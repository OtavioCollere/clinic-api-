import { Procedure as PrismaProcedure, type Prisma } from '@prisma/client'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'
import { Procedure } from 'src/domain/management/enterprise/entities/procedure'

export class PrismaProcedureMapper {
  static toDomain(raw: PrismaProcedure): Procedure {
    return Procedure.create(
      {
        appointmentId: new UniqueEntityID(raw.appointmentId),
        userId: new UniqueEntityID(raw.userId),
        name: raw.name as 'BOTOX' | 'PREENCHIMENTO' | 'LAVIEEN',
        value: raw.value,
        product: raw.product ?? undefined,
        region: raw.region,
        updatedBy: raw.updatedById ?? undefined,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id)
    )
  }

  static toPrisma(procedure: Procedure): Prisma.ProcedureUncheckedCreateInput {
    return {
      id: procedure.id.toString(),
      appointmentId: procedure.appointmentId.toString(),
      userId: procedure.userId.toString(),
      name: procedure.name as 'BOTOX' | 'PREENCHIMENTO' | 'LAVIEEN',
      value: procedure.value,
      product: procedure.product ?? null,
      region: procedure.region,
      updatedById: procedure.updatedBy ?? null,
      createdAt: procedure.createdAt,
      updatedAt: procedure.updatedAt,
    }
  }
}
