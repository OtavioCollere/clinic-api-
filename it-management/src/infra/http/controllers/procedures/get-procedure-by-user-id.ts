

import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
  UsePipes
} from "@nestjs/common";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import z from "zod";
import { isLeft, unwrapEither } from "src/core/either/either";
import { UserNotFoundError } from "src/core/errors/user-not-found-error";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { RegisterProcedureUseCase } from "src/domain/management/application/use-cases/procedures/register-procedure";
import { AppointmentNotFoundError } from "src/core/errors/appointment-not-found-error";

// Schema de validação para criação de procedimento
const registerProcedureBodySchema = z.object({
  userId: z.string().uuid(),
  appointmentId: z.string().uuid(),
  name: z.enum(['BOTOX', 'PREENCHIMENTO', 'LAVIEEN']),
  product: z.string().optional(),
  region: z.string(),
  value: z.number()
});

type RegisterProcedureBodySchema = z.infer<typeof registerProcedureBodySchema>;

@Controller('/procedures')
@ApiTags('Procedures')
export class RegisterProcedureController {
  constructor(private registerProcedure: RegisterProcedureUseCase) {}

  @ApiOperation({ summary: "Register a new procedure" })
  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(registerProcedureBodySchema))
  @ApiBody({
    description: "Procedure registration data",
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string', format: 'uuid', example: '9f8b1f16-bf25-4b82-b0c5-3a9d94db1fcb' },
        appointmentId: { type: 'string', format: 'uuid', example: 'b2cbb7a0-5f9f-4d47-82f6-94a9492b19c7' },
        name: { type: 'string', enum: ['BOTOX', 'PREENCHIMENTO', 'LAVIEEN'], example: 'BOTOX' },
        product: { type: 'string', example: 'Botox Premium', nullable: true },
        region: { type: 'string', example: 'Forehead' },
        value: { type: 'number', example: 1200.50 },
      },
      required: ['userId', 'appointmentId', 'name', 'region', 'value'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Procedure created successfully',
    schema: {
      example: {
        procedure: {
          id: 'uuid',
          userId: 'uuid',
          appointmentId: 'uuid',
          name: 'BOTOX',
          product: 'Botox Premium',
          region: 'Forehead',
          value: 1200.50,
          createdAt: '2025-08-07T14:30:00Z'
        }
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid input data',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - User or Appointment does not exist',
    schema: {
      examples: {
        userNotFound: {
          value: { message: 'User with the specified ID does not exist.' }
        },
        appointmentNotFound: {
          value: { message: 'Appointment with the specified ID does not exist.' }
        }
      }
    }
  })

  async handle(@Body() body: RegisterProcedureBodySchema) {
    const { userId, appointmentId, name, product, region, value } = body;

    const result = await this.registerProcedure.execute({
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
