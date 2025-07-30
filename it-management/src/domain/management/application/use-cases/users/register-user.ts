import { Injectable } from "@nestjs/common";
import { Either, makeLeft, makeRight } from "src/core/either/either";
import { User } from "src/domain/management/enterprise/entities/user";
import { EmailAlreadyExistsError } from "src/core/errors/email-already-exists-error";
import type { HashGenerator } from "../../cryptography/hash-generator";
import type { UsersRepository } from "../../repositories/users-repository";


interface RegisterUserUseCaseRequest {
  name : string
  email : string
  password : string
  sector : string
}

type RegisterUserUseCaseResponse = Either<
  EmailAlreadyExistsError,
  {
    user: User;
  }
>;

@Injectable()
export class RegisterUserUseCase{

  constructor(
    private usersRepository : UsersRepository,
    private hashGenerator : HashGenerator
  ) {}

  async execute({name, email, password, sector} : RegisterUserUseCaseRequest ) : Promise<RegisterUserUseCaseResponse> {

    const emailExists = await this.usersRepository.findByEmail(email);

    if(emailExists) {
      return makeLeft(new EmailAlreadyExistsError())
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    const user = User.create({
      name,
      email,
      password: hashedPassword,
      sector
    })

    await this.usersRepository.create(user);

    return makeRight({
      user
    })

  }
}