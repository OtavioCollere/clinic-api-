import { BadRequestException, Body, Controller, HttpCode, NotFoundException, Patch, UsePipes } from "@nestjs/common";
import { CancelAppointmentUseCase } from "src/domain/management/application/use-cases/appointments/cancel-appointment";
import z from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { isLeft, unwrapEither } from "src/core/either/either";
import { AppointmentFoundError } from "src/core/errors/appointment-not-found-error";
import { UserNotFoundError } from "src/core/errors/user-not-found-error";

const cancelAppointmentBodySchema = z.object({
  appointmentId: z.string().uuid(),
  updatedBy: z.string().uuid(),
})

type CancelAppointmentBodySchema = z.infer<typeof cancelAppointmentBodySchema>

@Controller('/appointments/cancel')
export class CancelAppointmentController {
  
  constructor(
    private cancelAppointment: CancelAppointmentUseCase
  ) {}

  @Patch()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(cancelAppointmentBodySchema))
  async handle(@Body() body: CancelAppointmentBodySchema) {

    const { appointmentId, updatedBy } = body;

    const result = await this.cancelAppointment.execute({
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
      appointment
    }
  }
}
