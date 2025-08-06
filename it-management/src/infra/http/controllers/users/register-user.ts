import { BadRequestException, Body, ConflictException, Controller, HttpCode, Post, UsePipes } from "@nestjs/common";
import { isLeft, unwrapEither } from "src/core/either/either";
import { EmailAlreadyExistsError } from "src/core/errors/email-already-exists-error";
import { RegisterUserUseCase } from "src/domain/management/application/use-cases/users/register-user";
import { Public } from "src/infra/auth/public";
import z from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";


const registerUserBodySchema = z.object({
  name : z.string(),
  email : z.string().email(),
  password : z.string().min(6),
  sector: z.string()
})

type RegisterUserBodySchema = z.infer<typeof registerUserBodySchema>;

@Controller('/users')
@Public()
@ApiTags('Auth')
export class RegisterUserController{

  constructor(private registerUser: RegisterUserUseCase){}

  @ApiOperation({summary : "Register a new user"})
  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(registerUserBodySchema))

  @ApiBody({
    description : "User registration data",
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        email: { type: 'string' },
        password: { type: 'string' },
        sector: { type: 'string' }
      },
      required: ['name', 'email', 'password', 'sector']
    },
  })

  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    schema: {
      example: {
        user: { id: 'uuid' },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Email already exists ( Conflict Exception )',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  
  async handle(@Body() body : RegisterUserBodySchema) {
    const { name, email, password, sector } = body;

    const result = await this.registerUser.execute({
      name,
      email,
      password,
      sector
    });

    if(isLeft(result)) {
      const error = unwrapEither(result);

      switch(error.constructor) {
        case EmailAlreadyExistsError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException();
      }
    }

    const user = unwrapEither(result).user;
    
    return {
      user :{
        id: user.id.toString()
      } 
    };
  }

  

}