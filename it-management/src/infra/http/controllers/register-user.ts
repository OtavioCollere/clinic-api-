import { BadRequestException, Body, ConflictException, Controller, HttpCode, Post, UsePipes } from "@nestjs/common";
import { isLeft, unwrapEither } from "src/core/either/either";
import { EmailAlreadyExistsError } from "src/core/errors/email-already-exists-error";
import { RegisterUserUseCase } from "src/domain/management/application/use-cases/users/register-user";
import { Public } from "src/infra/auth/public";
import z from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";


const registerUserBodySchema = z.object({
  name : z.string(),
  email : z.string().email(),
  password : z.string().min(6),
  sector: z.string()
})

type RegisterUserBodySchema = z.infer<typeof registerUserBodySchema>;

@Controller('/users')
@Public()
export class RegisterUserController{

  constructor(private registerUser: RegisterUserUseCase){}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(registerUserBodySchema))
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