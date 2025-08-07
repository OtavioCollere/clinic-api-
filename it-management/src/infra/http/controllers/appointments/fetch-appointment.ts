import {
  Controller,
  Get,
  HttpCode,
  Query,
  BadRequestException,
  UsePipes
} from "@nestjs/common";
import { FetchAppointmentsUseCase } from "src/domain/management/application/use-cases/appointments/fetch-appointments";
import z from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { isLeft, unwrapEither } from "src/core/either/either";
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";

// Schema para validar os query params
const fetchAppointmentsQuerySchema = z.object({
  query: z.string().optional().default(''),
  page: z.coerce.number().int().positive().default(1),
});

type FetchAppointmentsQuerySchema = z.infer<typeof fetchAppointmentsQuerySchema>;

@Controller('/appointments')
@ApiTags('Appointments')
export class FetchAppointmentsController {
  constructor(
    private fetchAppointments: FetchAppointmentsUseCase
  ) {}

  @Get()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(fetchAppointmentsQuerySchema))
  @ApiOperation({ summary: "Fetch appointments with optional search and pagination" })

  @ApiQuery({
    name: 'query',
    required: false,
    description: 'Search term to filter appointments',
    type: String,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Pagination page number',
    type: Number,
  })

  @ApiResponse({
    status: 200,
    description: 'List of appointments returned successfully',
    schema: {
      example: {
        appointments: [
          {
            id: 'uuid',
            name: 'Agendamento 1',
            status: 'PENDING',
            dateHour: '2025-01-01T10:00:00.000Z',
            duration: 60,
            userId: 'uuid'
          }
        ],
      },
    },
  })

  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid input or parameters',
  })

  async handle(@Query() queryParams: FetchAppointmentsQuerySchema) {
    const { query, page } = queryParams;

    const result = await this.fetchAppointments.execute({ query, page });

    if (isLeft(result)) {
      throw new BadRequestException('Failed to fetch appointments');
    }

    return {
      appointments: unwrapEither(result).appointments,
    };
  }
}
