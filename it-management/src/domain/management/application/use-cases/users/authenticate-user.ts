import { Injectable } from "@nestjs/common";
import { makeLeft, makeRight, type Either } from "src/core/either/either";
import { WrongCredentialsError } from "src/core/errors/wrong-credentials-error";
import type { UsersRepository } from "../../repositories/users-repository";
import type { HashComparer } from "../../cryptography/hash-comparer";
import type { Encrypter } from "../../cryptography/encrypter";

export class AuthenticatheUserUseCaseRequest{
  email : string
  password : string
}

type AuthenticatheUserUseCaseResponse = Either<
WrongCredentialsError,
{
  accessToken : string
} 
>


@Injectable()
export class AuthenticatheUserUseCase{

  constructor(
    private usersRepository: UsersRepository,
    private hashComparer : HashComparer,
    private encrypter : Encrypter
  ){}

  async execute({email, password} : AuthenticatheUserUseCaseRequest) : Promise<AuthenticatheUserUseCaseResponse> {
      
    const user = await this.usersRepository.findByEmail(email);

    if(!user) {
      return makeLeft(new WrongCredentialsError())
    }

    const isPasswordValid = await this.hashComparer.compare(password, user.password);

    if (!isPasswordValid) {
      return makeLeft(new WrongCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub : user.id
    })

    return makeRight({
      accessToken
    })

  }
}