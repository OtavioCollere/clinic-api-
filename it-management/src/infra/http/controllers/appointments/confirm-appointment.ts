import { BadRequestException, Body, Controller, HttpCode, NotFoundException, Patch, UsePipes } from "@nestjs/common";
import { ConfirmAppointmentUseCase } from "src/domain/management/application/use-cases/appointments/confirm-appointment";
import z from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { isLeft, unwrapEither } from "src/core/either/either";
import { AppointmentFoundError } from "src/core/errors/appointment-not-found-error";
import { UserNotFoundError } from "src/core/errors/user-not-found-error";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

// Schema de validação do corpo da requisição para confirmação do agendamento
const confirmAppointmentBodySchema = z.object({
  appointmentId: z.string().uuid(),
  updatedBy: z.string().uuid(),
});

type ConfirmAppointmentBodySchema = z.infer<typeof confirmAppointmentBodySchema>;

@Controller('/appointments/confirm')
@ApiTags('Appointments') // Agrupando no Swagger
export class ConfirmAppointmentController {

  constructor(
    private confirmAppointment: ConfirmAppointmentUseCase
  ) {}

  @ApiOperation({ summary: "Confirm an appointment" })
  @Patch()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(confirmAppointmentBodySchema))

  @ApiBody({
    description: "Appointment confirmation data",
    schema: {
      type: 'object',
      properties: {
        appointmentId: { type: 'string', format: 'uuid' },
        updatedBy: { type: 'string', format: 'uuid' },
      },
      required: ['appointmentId', 'updatedBy'],
    },
  })

  @ApiResponse({
    status: 200,
    description: 'Appointment successfully confirmed',
    schema: {
      example: {
        appointment: {
          appointmentId: 'uuid',
          updatedBy: 'uuid',
          status: 'confirmed',
        },
      },
    },
  })

  @ApiResponse({
    status: 400,
    description: 'Bad Request - Validation or other issues',
    schema: {
      example: { message: 'Invalid input data.' },
    },
  })

  @ApiResponse({
    status: 404,
    description: 'Appointment or User not found',
    schema: {
      example: { message: 'Appointment or user not found.' },
    },
  })

  async handle(@Body() body: ConfirmAppointmentBodySchema) {
    const { appointmentId, updatedBy } = body;

    const result = await this.confirmAppointment.execute({
      appointmentId,
      updatedBy,
    });

    if (isLeft(result)) {
      const error = unwrapEither(result);

      switch (error.constructor) {
        case AppointmentFoundError:
          throw new NotFoundException(error.message);
        case UserNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const appointment = unwrapEither(result).appointment;

    return {
      appointment,
    };
  }
}
