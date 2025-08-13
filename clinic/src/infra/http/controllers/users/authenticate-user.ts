import { BadRequestException, Body, Controller, HttpCode, Post, UnauthorizedException, UsePipes } from "@nestjs/common";
import  { AuthenticatheUserUseCase } from "src/domain/management/application/use-cases/users/authenticate-user";
import z from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { isLeft, unwrapEither } from "src/core/either/either";
import { WrongCredentialsError } from "src/core/errors/wrong-credentials-error";
import { Public } from "src/infra/auth/public";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

const authenticateUserBodySchema = z.object({
  email : z.string().email(),
  password : z.string()
})

type AuthenticateUserBodySchema = z.infer<typeof authenticateUserBodySchema>;

@Controller('/session')
@Public()
@ApiTags('Auth')
export class AuthenticateController{

  constructor(private authenticateUser : AuthenticatheUserUseCase) {}

  @ApiOperation({ summary: "Authenticate a user with JWT" })
  @Post()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(authenticateUserBodySchema))

  @ApiBody({
    description : "User authentication data",
    schema : {
      type : 'object',
      properties : {
        email: { type: 'string', format: 'email' },
        password: { type: 'string' }
      }, 
      required : ['email', 'password']
    }
  })

  @ApiResponse({
    status: 200,
    description : "User authenticated successfully",
    schema : {
      example : {
        access_token: "41lmiof12i0ofm12ionjfa_otmevjaehnasneska_lcaets"
      }
    }
  })

  @ApiResponse({
    status: 401,
    description: 'Wrong credentials error ( Unathourized exception )',
  })

  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })

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