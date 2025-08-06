import { BadRequestException, Body, ConflictException, Controller, HttpCode, NotFoundException, Post, UsePipes } from "@nestjs/common";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import z from "zod";
import { CreateAppointmentUseCase } from "src/domain/management/application/use-cases/appointments/create-appointment";
import { isLeft, unwrapEither } from "src/core/either/either";
import { UserNotFoundError } from "src/core/errors/user-not-found-error";
import { InvalidIntervalError } from "src/core/errors/invalid-interval-error";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

// Schema de validação do corpo da requisição para o agendamento
const createAppointmentBodySchema = z.object({
  userId: z.string().uuid(),
  name: z.string(),
  description: z.string().optional(),
  duration: z.number(),
  dateHour: z.date(),
});

type CreateAppointmentBodySchema = z.infer<typeof createAppointmentBodySchema>;

@Controller('/appointments')
@ApiTags('Appointments') // Tag para organização no Swagger
export class CreateAppointmentController {
  constructor(private createAppointment: CreateAppointmentUseCase) {}

  @ApiOperation({ summary: "Create a new appointment" })
  @Post()
  @HttpCode(201) // Código de status para criação com sucesso
  @UsePipes(new ZodValidationPipe(createAppointmentBodySchema)) // Validação com Zod

  @ApiBody({
    description: "Appointment creation data",
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string', format: 'uuid' },
        name: { type: 'string' },
        description: { type: 'string', nullable: true },
        duration: { type: 'number' },
        dateHour: { type: 'string', format: 'date-time' },
      },
      required: ['userId', 'name', 'duration', 'dateHour'], // Campos obrigatórios
    },
  })

  @ApiResponse({
    status: 201,
    description: 'Appointment created successfully',
    schema: {
      example: {
        appointment: {
          userId: 'uuid',
          name: 'Doctor Appointment',
          description: 'Routine checkup',
          duration: 30,
          dateHour: '2025-08-07T14:30:00Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    schema: {
      example: {
        message: 'Invalid input data.',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found (Not Found Exception)',
    schema: {
      example: {
        message: 'User with the specified ID does not exist.',
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Invalid time interval (Conflict Exception)',
    schema: {
      example: {
        message: 'The selected time interval is invalid.',
      },
    },
  })

  async handle(@Body() body: CreateAppointmentBodySchema) {
    const { userId, name, description, duration, dateHour } = body;

    const result = await this.createAppointment.execute({
      userId,
      name,
      description,
      duration,
      dateHour,
    });

    if (isLeft(result)) {
      const error = unwrapEither(result);

      switch (error.constructor) {
        case UserNotFoundError:
          throw new NotFoundException(error.message);
        case InvalidIntervalError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException();
      }
    }

    const appointment = unwrapEither(result).appointment;

    return {
      appointment,
    };
  }
}
