import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  UsePipes,
} from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import z from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";

import { isLeft, unwrapEither } from "src/core/either/either";

import { AppointmentNotFoundError } from "src/core/errors/appointment-not-found-error";
import { StatusIsNotPedingError } from "src/core/errors/status-is-not-peding-error";
import { EditorUserFoundError } from "src/core/errors/editor-user-not-found-error";
import { UserNotFoundError } from "src/core/errors/user-not-found-error";
import { InvalidDateError } from "src/core/errors/invalid-date-error";
import { InvalidIntervalError } from "src/core/errors/invalid-interval-error";
import { RescheduleAppointmentUseCase } from "src/domain/management/application/use-cases/appointments/reschedule-appointment";

// Schema de validação do corpo da requisição para o reagendamento
const rescheduleAppointmentBodySchema = z.object({
  updatedBy: z.string().uuid(),
  userId: z.string().uuid(),
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  duration: z.number().int().positive(),
  dateHour: z.coerce.date(), // aceita ISO string '2025-08-07T14:30:00Z'
});

type RescheduleAppointmentBodySchema = z.infer<typeof rescheduleAppointmentBodySchema>;

@Controller("/appointments")
@ApiTags("Appointments")
export class RescheduleAppointmentController {
  constructor(private rescheduleAppointment: RescheduleAppointmentUseCase) {}

  @ApiOperation({ summary: "Reschedule (and optionally edit) an appointment" })
  @ApiParam({
    name: "appointmentId",
    description: "Appointment ID to reschedule",
    required: true,
    schema: { type: "string", format: "uuid" },
  })
  @Patch(":appointmentId/reschedule")
  @HttpCode(200)
  @ApiBody({
    description: "Reschedule data",
    schema: {
      type: "object",
      properties: {
        updatedBy: { type: "string", format: "uuid" },
        userId: { type: "string", format: "uuid" },
        name: { type: "string", minLength: 1 },
        description: { type: "string" },
        duration: { type: "number", minimum: 1 },
        dateHour: { type: "string", format: "date-time" }
      },
      required: ["updatedBy", "userId", "duration", "dateHour"]
    }
  })
  async handle(
    @Param("appointmentId") appointmentId: string,
    @Body(new ZodValidationPipe(rescheduleAppointmentBodySchema)) body: RescheduleAppointmentBodySchema,
  ) {
    const result = await this.rescheduleAppointment.execute({
      appointmentId,
      ...body,
    });

    if (isLeft(result)) {
      const error = unwrapEither(result);

      switch (error.constructor) {
        case AppointmentNotFoundError:
          throw new NotFoundException(error.message);
        case StatusIsNotPedingError:
          throw new ConflictException(error.message);
        case EditorUserFoundError:
          throw new NotFoundException(error.message);
        case UserNotFoundError:
          throw new NotFoundException(error.message);
        case InvalidDateError:
          throw new BadRequestException(error.message);
        case InvalidIntervalError:
          throw new BadRequestException(error.message);
        default:
          throw new BadRequestException("Unexpected error");
      }
    }

    return unwrapEither(result);
  }
}
