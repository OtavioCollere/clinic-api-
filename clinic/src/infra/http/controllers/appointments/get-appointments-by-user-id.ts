import { BadRequestException, Controller, Get, HttpCode, NotFoundException, Param, UsePipes } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import z from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { GetAppointmentsUseCaseByUserId } from "src/domain/management/application/use-cases/appointments/get-appointments-by-user-id";
import { isLeft, unwrapEither } from "src/core/either/either";
import { UserNotFoundError } from "src/core/errors/user-not-found-error";

const getAppointmentsByUserIdParamSchema = z.object({
  userId: z.string().uuid(),
})

type GetAppointmentsByUserIdParamSchema = z.infer<typeof getAppointmentsByUserIdParamSchema>

@Controller('/appointments')
@ApiTags('Appointments')
export class GetAppointmentsByUserIdController{

  constructor(
    private getAppointmentsByUserId : GetAppointmentsUseCaseByUserId
  ) {}

  @ApiOperation({summary : 'Get appointments by user ID'})
  @Get(':userId')
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(getAppointmentsByUserIdParamSchema))
  
  @ApiParam({
    description : 'The ID of the user whose appointments you want to retrieve',
    name : 'userId',
    type : String,
    required : true,
  })

  @ApiResponse({
   status : 200,
  description : 'Appointments retrieved successfully',
  schema: {
      type: 'object',
      properties: {
        appointments: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              userId: { type: 'string', format: 'uuid' },
              dateHour: { type: 'string', format: 'date-time' },
              status: { type: 'string' },
            },
          },
        },
      },
    },
  })

  @ApiResponse({
    status: 400,
    description: 'User not found error ( NotFoundException )',
    schema: {
      example: { message: 'Invalid input data.' },
    },
  })


  @ApiResponse({
    status: 404,
    description: 'Bad Request - Validation or other issues',
  })

  
  async handle(@Param() params : GetAppointmentsByUserIdParamSchema ) {

    const userId = params.userId;

    const result = await this.getAppointmentsByUserId.execute({
      userId
    })

    if (isLeft(result))
    {

      const error = unwrapEither(result);

      switch(error.constructor) {
        case UserNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException(error.message)
      }

    }

    const { appointments } = unwrapEither(result)
    return { appointments }
  }
}