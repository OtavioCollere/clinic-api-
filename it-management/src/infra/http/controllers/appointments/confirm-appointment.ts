import { BadRequestException, Body, Controller, HttpCode, NotFoundException, Patch, UsePipes } from "@nestjs/common";
import { ConfirmAppointmentUseCase } from "src/domain/management/application/use-cases/appointments/confirm-appointment";
import z from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { isLeft, unwrapEither } from "src/core/either/either";
import { AppointmentFoundError } from "src/core/errors/appointment-not-found-error";
import { UserNotFoundError } from "src/core/errors/user-not-found-error";

const confirmAppointmentBodySchema = z.object({
  appointmentId: z.string().uuid(),
  updatedBy: z.string().uuid(),
})

type ConfirmAppointmentBodySchema = z.infer<typeof confirmAppointmentBodySchema>

@Controller('/appointments/cancel')
export class ConfirmAppointmentController{
  
  constructor(
    private confirmAppointment : ConfirmAppointmentUseCase
  ){}

  @Patch()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(confirmAppointmentBodySchema))
  async handle(@Body() body : ConfirmAppointmentBodySchema) {
    
    const { appointmentId, updatedBy } = body;

    const result = await this.confirmAppointment.execute({
      appointmentId,
      updatedBy
    });

    if(isLeft(result)){

      const error = unwrapEither(result);

      switch (error.constructor) {
        case AppointmentFoundError:
          throw new NotFoundException(error.message)
        case UserNotFoundError:
          throw new NotFoundException(error.message)
        default :
          throw new BadRequestException(error.message)
      }

    }

    const appointment = unwrapEither(result).appointment;

    return {
      appointment
    }

  }
}