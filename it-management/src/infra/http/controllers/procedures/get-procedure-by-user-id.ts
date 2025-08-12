import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Param,
  UsePipes
} from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import z from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { isLeft, unwrapEither } from "src/core/either/either";
import { GetProceduresByUserIdUseCase } from "src/domain/management/application/use-cases/procedures/get-procedures-by-user-id";

// Schema de validação para o param
const getProcedureByUserIdParamSchema = z.object({
  userId: z.string().uuid(),
});
type GetProcedureByUserIdParamSchema = z.infer<typeof getProcedureByUserIdParamSchema>;

@Controller('/procedures')
@ApiTags('Procedures')
export class GetProcedureByUserIdController {
  constructor(private getProcedureByUserId: GetProceduresByUserIdUseCase) {}

  @ApiOperation({ summary: "Get procedures by user id" })
  @Get(':userId')
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(getProcedureByUserIdParamSchema))
  @ApiParam({
    name: 'userId',
    description: 'User ID (UUID)',
    required: true,
    schema: { type: 'string', format: 'uuid', example: '9f8b1f16-bf25-4b82-b0c5-3a9d94db1fcb' },
  })
  @ApiResponse({
    status: 200,
    description: 'Procedures found (can be empty)',
    schema: {
      example: {
        procedures: [
          {
            id: 'c2db5a3b-7b6c-4c8b-8f1c-1f2e3d4a5b6c',
            userId: '9f8b1f16-bf25-4b82-b0c5-3a9d94db1fcb',
            appointmentId: 'b2cbb7a0-5f9f-4d47-82f6-94a9492b19c7',
            name: 'BOTOX',
            product: 'Botox Premium',
            region: 'Forehead',
            value: 1200.50,
            createdAt: '2025-08-07T14:30:00.000Z'
          }
        ]
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid userId (must be UUID)',
    schema: {
      example: { message: 'Validation failed for parameter userId.' }
    }
  })
  async handle(@Param() param: GetProcedureByUserIdParamSchema) {
    const { userId } = param;

    const result = await this.getProcedureByUserId.execute({ userId });

    // Mantém compatibilidade se no futuro o use case retornar Left
    if (isLeft(result)) {
      throw new BadRequestException();
    }

    const { procedures } = unwrapEither(result);
    return { procedures };
  }
}
