import { expect, beforeEach, describe, it } from "vitest";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { isLeft, isRight, unwrapEither } from "src/core/either/either";
import { MakeUser } from "test/factories/make-user";
import { FakeEncrypter } from "test/cryptography/fake-encrypter";
import { WrongCredentialsError } from "src/core/errors/wrong-credentials-error";
import { AuthenticatheUserUseCase } from "../authenticate-user";

describe("Register user use case", () => {

  let sut : AuthenticatheUserUseCase
  let inMemoryUsersRepository : InMemoryUsersRepository
  let fakeHasher : FakeHasher
  let fakeEncrypter : FakeEncrypter

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    fakeHasher = new FakeHasher();
    fakeEncrypter = new FakeEncrypter();
    sut = new AuthenticatheUserUseCase(inMemoryUsersRepository, fakeHasher, fakeEncrypter)
  })

  it("should be able to authenticate a user", async () => {
    
    const user = MakeUser({
      email : "otavio@email.com",
      password : await fakeHasher.hash('1234')
    })

    await inMemoryUsersRepository.items.push(user);
    
    const result = await sut.execute({
      email : "otavio@email.com",
      password : '1234'
    })

    expect(isRight(result)).toBeTruthy();
    if(isRight(result)){
      expect(unwrapEither(result).accessToken).toBeDefined()
    }

  })

  it("should not be able to authenticate a user with non-existent email", async () => {
    
    const result = await sut.execute({
      email : "otavio@email.com",
      password : '1234'
    })

    expect(isLeft(result)).toBeTruthy();
    expect(unwrapEither(result)).toBeInstanceOf(WrongCredentialsError)

  })


  it("should not be able to authenticate a user with incorrect password", async () => {
   
    const user = MakeUser({
      email : "otavio@email.com",
      password : '1234'
    })

    await inMemoryUsersRepository.create(user);

    const result = await sut.execute({
      email : "otavio@email.com",
      password : 'incorrect123'
    })

    expect(isLeft(result)).toBeTruthy();
    expect(unwrapEither(result)).toBeInstanceOf(WrongCredentialsError)

  })

})