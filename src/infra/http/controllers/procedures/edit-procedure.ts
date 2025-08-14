import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  UsePipes
} from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import z from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { isLeft, unwrapEither } from "src/core/either/either";
import { EditProcedureUseCase } from "src/domain/management/application/use-cases/procedures/edit-procedure";
import { AppointmentNotFoundError } from "src/core/errors/appointment-not-found-error";
import { UserNotFoundError } from "src/core/errors/user-not-found-error";
import { ProcedureNotFoundError } from "src/core/errors/procedure-not-found-error";

const editProcedureBodySchema = z.object({
  procedureId : z.string().uuid(),
  updatedBy : z.string().uuid(),
  userId : z.string().uuid().optional(),
  appointmentId : z.string().uuid().optional(),
  name : z.enum(['BOTOX', 'PREENCHIMENTO', 'LAVIEEN']).optional(),
  product : z.string().optional(),
  region : z.string().optional(),
  value : z.number().optional(),
})

type EditProcedureBodySchema = z.infer<typeof editProcedureBodySchema>;

@ApiTags('Procedures')
@Controller('/procedures')
export class EditProcedureController {
  constructor(private editProcedure: EditProcedureUseCase) {}

  @ApiOperation({ summary: "Edit a procedure" })
  @Patch()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(editProcedureBodySchema))
  @ApiBody({
    description: "Fields to update",
    schema: {
      type: 'object',
      properties: {
        updatedBy: { type: 'string', format: 'uuid', example: 'c7f8d2a1-5e3b-4a9f-8c0d-1e2f3a4b5c6d', nullable: true },
        userId: { type: 'string', format: 'uuid', example: '9f8b1f16-bf25-4b82-b0c5-3a9d94db1fcb', nullable: true },
        appointmentId: { type: 'string', format: 'uuid', example: 'b2cbb7a0-5f9f-4d47-82f6-94a9492b19c7', nullable: true },
        name: { type: 'string', enum: ['BOTOX', 'PREENCHIMENTO', 'LAVIEEN'], example: 'BOTOX', nullable: true },
        product: { type: 'string', example: 'Botox Premium', nullable: true },
        region: { type: 'string', example: 'Forehead', nullable: true },
        value: { type: 'number', example: 1350.00, nullable: true },
      },
      required: [],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Procedure updated successfully',
    schema: {
      example: {
        procedure: {
          id: 'uuid',
          userId: 'uuid',
          appointmentId: 'uuid',
          name: 'BOTOX',
          product: 'Botox Premium',
          region: 'Forehead',
          value: 1350.00,
          updatedAt: '2025-08-13T12:00:00Z'
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid input data' })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    schema: {
      examples: {
        procedureNotFound: { value: { message: 'Procedure not found.' } },
        userNotFound: { value: { message: 'User with the specified ID does not exist.' } },
        appointmentNotFound: { value: { message: 'Appointment with the specified ID does not exist.' } },
      }
    }
  })
  async handle(
    @Body() body: EditProcedureBodySchema
  ) {
    const { procedureId, updatedBy, userId, appointmentId, name, product, region, value } = body;

    const result = await this.editProcedure.execute({
      procedureId,
      updatedBy,
      userId,
      appointmentId,
      name,
      product,
      region,
      value
    });

    if (isLeft(result)) {
      const error = unwrapEither(result);

      switch (error.constructor) {
        case ProcedureNotFoundError:
          throw new NotFoundException(error.message);
        case AppointmentNotFoundError:
          throw new NotFoundException(error.message);
        case UserNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException();
      }
    }

    const { procedure } = unwrapEither(result);
    return { procedure };
  }
}
