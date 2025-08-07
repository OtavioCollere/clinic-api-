import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { InMemoryAppointmentsRepository } from "test/repositories/in-memory-appointments-repository";
import { describe, beforeEach, it, expect } from "vitest";
import { MakeUser } from "test/factories/make-user";
import { MakeAppointment } from "test/factories/make-appointment";
import { isLeft, isRight, unwrapEither } from "src/core/either/either";
import { AppointmentNotFoundError } from "src/core/errors/appointment-not-found-error";
import { GetAppointmentsUseCaseByUserId } from "../get-appointments-by-user-id";
import { UserNotFoundError } from "src/core/errors/user-not-found-error";

describe("Get appointment by user id use case unit tests", () => {
  let sut: GetAppointmentsUseCaseByUserId;
  let inMemoryAppointmentsRepository: InMemoryAppointmentsRepository;
  let inMemoryUsersRepository: InMemoryUsersRepository;

  beforeEach(() => {
    inMemoryAppointmentsRepository = new InMemoryAppointmentsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new GetAppointmentsUseCaseByUserId(
      inMemoryUsersRepository,
      inMemoryAppointmentsRepository
    );
  });

  it("should get appointments by user id", async () => {
      const user = MakeUser({})
      inMemoryUsersRepository.items.push(user);

      for(let i=0; i < 5; i++)
      {
        inMemoryAppointmentsRepository.items.push(MakeAppointment({
          userId : user.id
        }))
      }

      const result = await sut.execute({userId : user.id.toString()})

      expect(isRight(result)).toBeTruthy()
      if(isRight(result))
      {
        expect(unwrapEither(result).appointments).toHaveLength(5)
        expect(unwrapEither(result).appointments[0].userId).toEqual(user.id)
      }
      
  });


  it("should not be able to get appointments with non existent user id", async () => {
    const result = await sut.execute({userId : 'non-existent'})

    expect(isLeft(result)).toBeTruthy()
    expect(unwrapEither(result)).toBeInstanceOf(UserNotFoundError)
  })


});
