import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Query,
  UsePipes,
} from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import z from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { isLeft, unwrapEither } from "src/core/either/either";
import type { FetchProceduresUseCase } from "src/domain/management/application/use-cases/procedures/fetch-procedures";

const fetchProceduresQuerySchema = z.object({
  query: z.string().trim().min(1),
  page: z.coerce.number().int().min(1).default(1),
});
type FetchProceduresQuerySchema = z.infer<typeof fetchProceduresQuerySchema>;

@Controller("/procedures")
@ApiTags("Procedures")
export class FetchProceduresController {
  constructor(private fetchProcedures: FetchProceduresUseCase) {}

  @ApiOperation({ summary: "Fetch procedures (search + pagination)" })
  @Get()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(fetchProceduresQuerySchema))
  @ApiQuery({ name: "query", type: String, example: "BOTOX", required: true })
  @ApiQuery({ name: "page", type: Number, example: 1, required: false })
  @ApiResponse({
    status: 200,
    description: "Procedures fetched successfully",
    schema: {
      example: {
        procedures: [
          {
            id: "c2db5a3b-7b6c-4c8b-8f1c-1f2e3d4a5b6c",
            userId: "9f8b1f16-bf25-4b82-b0c5-3a9d94db1fcb",
            appointmentId: "b2cbb7a0-5f9f-4d47-82f6-94a9492b19c7",
            name: "BOTOX",
            product: "Botox Premium",
            region: "Forehead",
            value: 1200.5,
            createdAt: "2025-08-07T14:30:00.000Z",
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Bad Request - Invalid query params (query/page)",
    schema: { example: { message: "Validation failed for query parameters." } },
  })
  async handle(@Query() queryParams: FetchProceduresQuerySchema) {
    const { query, page } = queryParams;

    const result = await this.fetchProcedures.execute({ query, page });

    if (isLeft(result)) {
      throw new BadRequestException();
    }

    const { procedures } = unwrapEither(result);
    return { procedures };
  }
}
