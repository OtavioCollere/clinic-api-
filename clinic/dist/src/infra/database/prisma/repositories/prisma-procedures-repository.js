"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaProceduresRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const prisma_procedures_mapper_1 = require("../mappers/prisma-procedures-mapper");
let PrismaProceduresRepository = class PrismaProceduresRepository {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async create(procedure) {
        const data = prisma_procedures_mapper_1.PrismaProcedureMapper.toPrisma(procedure);
        await this.prismaService.procedure.create({
            data,
        });
        return procedure;
    }
    async save(procedure) {
        const data = prisma_procedures_mapper_1.PrismaProcedureMapper.toPrisma(procedure);
        await this.prismaService.procedure.update({
            where: { id: data.id },
            data,
        });
        return procedure;
    }
    async findById(id) {
        const row = await this.prismaService.procedure.findUnique({
            where: { id },
        });
        if (!row)
            return null;
        return prisma_procedures_mapper_1.PrismaProcedureMapper.toDomain(row);
    }
    async findByUserId(userId) {
        const rows = await this.prismaService.procedure.findMany({
            where: { userId },
        });
        return rows.map(prisma_procedures_mapper_1.PrismaProcedureMapper.toDomain);
    }
};
exports.PrismaProceduresRepository = PrismaProceduresRepository;
exports.PrismaProceduresRepository = PrismaProceduresRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaProceduresRepository);
const client_1 = require("@prisma/client");
async;
getAll({ query, page }, procedures_repository_1.QueryParams);
Promise < Procedure[] > {
    const: PAGE_SIZE = 20,
    const: where, Prisma: client_1.Prisma, : .ProcedureWhereInput | undefined, query
};
{
    OR: [
        {
            product: {
                contains: query,
                mode: client_1.Prisma.QueryMode.insensitive,
            },
        },
        {
            region: {
                contains: query,
                mode: client_1.Prisma.QueryMode.insensitive,
            },
        },
        ...(Object.values(client_1.ProcedureName).includes(query.toUpperCase())
            ? [{ name: { equals: query.toUpperCase() } }]
            : []),
    ],
    ;
}
undefined;
const procedures = await this.prismaService.procedure.findMany({
    where,
    take: PAGE_SIZE,
    skip: (page - 1) * PAGE_SIZE,
    orderBy: { createdAt: 'desc' },
});
return procedures.map(prisma_procedures_mapper_1.PrismaProcedureMapper.toDomain);
//# sourceMappingURL=prisma-procedures-repository.js.map