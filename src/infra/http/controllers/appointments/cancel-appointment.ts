import { BadRequestException, Body, Controller, HttpCode, NotFoundException, Patch, UsePipes } from "@nestjs/common";
import { CancelAppointmentUseCase } from "src/domain/management/application/use-cases/appointments/cancel-appointment";
import z from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { isLeft, unwrapEither } from "src/core/either/either";
import { UserNotFoundError } from "src/core/errors/user-not-found-error";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AppointmentNotFoundError } from "src/core/errors/appointment-not-found-error";

// Schema para validar o corpo da requisição
const cancelAppointmentBodySchema = z.object({
  appointmentId: z.string().uuid(),  // ID do agendamento (UUID)
  updatedBy: z.string().uuid(),      // ID do usuário que cancela (UUID)
});

type CancelAppointmentBodySchema = z.infer<typeof cancelAppointmentBodySchema>;

@Controller('/appointments/cancel')
@ApiTags('Appointments')  // Agrupando no Swagger
export class CancelAppointmentController {

  constructor(
    private cancelAppointment: CancelAppointmentUseCase
  ) {}

  @ApiOperation({ summary: "Cancel an appointment" })
  @Patch()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(cancelAppointmentBodySchema))

  @ApiBody({
    description: "Appointment cancellation data",
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
    description: 'Appointment successfully canceled',
    schema: {
      example: {
        appointment: {
          appointmentId: 'uuid',
          updatedBy: 'uuid',
          status: 'cancelled',
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

  async handle(@Body() body: CancelAppointmentBodySchema) {
    const { appointmentId, updatedBy } = body;

    const result = await this.cancelAppointment.execute({
      appointmentId,
      updatedBy,
    });

    if (isLeft(result)) {
      const error = unwrapEither(result);

      switch (error.constructor) {
        case AppointmentNotFoundError:
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
