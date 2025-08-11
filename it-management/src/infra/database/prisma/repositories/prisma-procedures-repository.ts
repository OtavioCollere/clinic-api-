import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import type { ProceduresRepository, QueryParams } from "src/domain/management/application/repositories/procedures-repository";
import type { Procedure } from "src/domain/management/enterprise/entities/procedure";
import { PrismaProcedureMapper } from "../mappers/prisma-procedures-mapper";

interface ProcedureName{
  BOTOX : string
  PREENCHIMENTO: string
  LAVIEEN: string
}

@Injectable()
export class PrismaProceduresRepository implements ProceduresRepository {
  constructor(
    private prismaService: PrismaService
  ) {}

  async create(procedure: Procedure): Promise<Procedure> {
    const data = PrismaProcedureMapper.toPrisma(procedure);

    await this.prismaService.procedure.create({
      data,
    });

    return procedure;
  }

  async save(procedure: Procedure): Promise<Procedure> {
    const data = PrismaProcedureMapper.toPrisma(procedure)
  
    await this.prismaService.procedure.update({
      where: { id: data.id },
      data,
    })
  
    return procedure
  }

  async findById(id: string): Promise<Procedure | null> {
    const row = await this.prismaService.procedure.findUnique({
      where: { id },
    });

    if (!row) return null;

    return PrismaProcedureMapper.toDomain(row);
  }

  async findByUserId(userId: string): Promise<Procedure[]> {
    const rows = await this.prismaService.procedure.findMany({
      where: { userId },
    });

    return rows.map(PrismaProcedureMapper.toDomain);
  }

  async getAll({ query, page }: QueryParams): Promise<Procedure[]> {
    const PAGE_SIZE = 20
  
    const where = query
      ? {
          OR: [
            { product: { contains: query, mode: 'insensitive' } },
            { region:  { contains: query, mode: 'insensitive' } },
            { name: query.toUpperCase() as unknown as ProcedureName } // enum match exato
          ],
        }
      : undefined
  
    const procedures = await this.prismaService.procedure.findMany({
      where,
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
      orderBy: { createdAt: 'desc' },
    })
  
    return procedures.map(PrismaProcedureMapper.toDomain)
  }
  
}
