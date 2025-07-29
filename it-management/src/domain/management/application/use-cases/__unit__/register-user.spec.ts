import { beforeAll, describe, it } from "vitest";
import { RegisterUserUseCase } from "./register-user";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { isLeft, isRight, unwrapEither } from "src/core/either/either";
import { MakeUser } from "test/factories/make-user";
import { EmailAlreadyExistsError } from "src/core/errors/email-already-exists-error";

describe("Register user use case", () => {

  let sut : RegisterUserUseCase
  let inMemoryUsersRepository : InMemoryUsersRepository
  let fakeHasher : FakeHasher

  beforeAll(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    fakeHasher = new FakeHasher();
    sut = new RegisterUserUseCase(inMemoryUsersRepository, fakeHasher)
  })

  it("should be able to register a new user", async () => {

    const result = await sut.execute({
      name : 'Otavio',
      email : 'Otavio@email.com',
      password : '1234',
      sector : 'IT'
    })

    expect(isRight(result)).toBeTruthy();
    if(isRight(result)){
      expect(inMemoryUsersRepository.items[0].id).toEqual(unwrapEither(result).user.id)
      expect(inMemoryUsersRepository.items[0].name).toEqual('Otavio')
    }

  })

  it("should not be able to register a user with an existing email", async () => {
    
    const user = await MakeUser({
      email : 'otavio@email.com'
    })

    const result = await sut.execute({
      email : 'otavio@email.com'
    })

    expect(isLeft(result)).toBeTruthy();
    expect(unwrapEither(result)).toBeInstanceOf(EmailAlreadyExistsError)
  })

})