import { BadRequestException, Body, Controller, HttpCode, Post, UnauthorizedException, UsePipes } from "@nestjs/common";
import  { AuthenticatheUserUseCase } from "src/domain/management/application/use-cases/users/authenticate-user";
import z from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { isLeft, unwrapEither } from "src/core/either/either";
import { WrongCredentialsError } from "src/core/errors/wrong-credentials-error";
import { Public } from "src/infra/auth/public";

const authenticateUserBodySchema = z.object({
  email : z.string().email(),
  password : z.string()
})

type AuthenticateUserBodySchema = z.infer<typeof authenticateUserBodySchema>;

@Controller('/session')
@Public()
export class AuthenticateController{

  constructor(private authenticateUser : AuthenticatheUserUseCase) {}

  @Post()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(authenticateUserBodySchema))
  async handle(@Body() body : AuthenticateUserBodySchema) {
    const { email, password } = body;

    const result = await this.authenticateUser.execute({
      email,
      password
    });

    if (isLeft(result)) {
      const error = unwrapEither(result);

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message);
        default:
          throw new BadRequestException();
      }
    }

    const accessToken  = unwrapEither(result).accessToken;

    return {
      access_token : accessToken
    };
  }
}