// import { BadRequestException, Body, ConflictException, Controller, HttpCode, NotFoundException, Patch, Post, UsePipes } from "@nestjs/common";
// import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
// import z from "zod";
// import { CreateAppointmentUseCase } from "src/domain/management/application/use-cases/appointments/create-appointment";
// import { isLeft, unwrapEither } from "src/core/either/either";
// import { UserNotFoundError } from "src/core/errors/user-not-found-error";
// import { InvalidIntervalError } from "src/core/errors/invalid-interval-error";


// const rescheduleAppointmentBodySchema = z.object({
//   userId : z.string().uuid(),
//   name : z.string(),
//   description : z.string().optional(),
//   duration : z.number(),
//   dateHour : z.date()
// })

// type RescheduleAppointmentBodySchema = z.infer<typeof rescheduleAppointmentBodySchema>

// @Controller('/appointments')
// export class RescheduleAppointmentController{

//   constructor(
//     private rescheduleAppointment : Reschu
//   ) {}

//   @Patch()
//   @HttpCode(200)
//   @UsePipes(new ZodValidationPipe(createAppointmentBodySchema))
//   async handle(@Body() body : CreateAppointmentBodySchema) {

//     const {userId, name, description, duration, dateHour} = body;

//     const result = await this.createAppointment.execute({
//       userId, name, description, duration, dateHour
//     })

//     if(isLeft(result))
//     {
//       const error = unwrapEither(result);

//       switch(error.constructor) {
//         case UserNotFoundError:
//           throw new NotFoundException(error.message);
//         case InvalidIntervalError:
//           throw new ConflictException(error.message)
//         default :
//           throw new BadRequestException()
//       }
//     }

//     const appointment = unwrapEither(result).appointment;

//     return {
//       appointment
//     }

//   }

// }