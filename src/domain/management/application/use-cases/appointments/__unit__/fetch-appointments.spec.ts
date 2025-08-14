import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { InMemoryAppointmentsRepository } from "test/repositories/in-memory-appointments-repository";
import { describe, beforeEach, it, expect } from "vitest";
import { MakeUser } from "test/factories/make-user";
import { MakeAppointment } from "test/factories/make-appointment";
import { isRight, unwrapEither } from "src/core/either/either";
import { FetchAppointmentsUseCase } from "../fetch-appointments";

describe("Fetch appointments use case unit tests", () => {
  let sut: FetchAppointmentsUseCase;
  let inMemoryAppointmentsRepository: InMemoryAppointmentsRepository;
  let inMemoryUsersRepository: InMemoryUsersRepository;

  beforeEach(() => {
    inMemoryAppointmentsRepository = new InMemoryAppointmentsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new FetchAppointmentsUseCase(
      inMemoryAppointmentsRepository
    );
  });

  it("should fetch appointments", async () => {
      const user = MakeUser({})
      inMemoryUsersRepository.items.push(user);

      for(let i=0; i < 10; i++)
      {
        inMemoryAppointmentsRepository.items.push(MakeAppointment({
          userId : user.id,
          description : `appointment ${i}`
        })),

        inMemoryAppointmentsRepository.items.push(MakeAppointment({
          userId : user.id
        }))
      }

      const result = await sut.execute({query : 'appointment', page : 1})

      expect(isRight(result)).toBeTruthy()
      if(isRight(result))
      {
        expect(unwrapEither(result).appointments).toHaveLength(10)
        expect(unwrapEither(result).appointments[0].userId).toEqual(user.id)
      }
      
  });

  it("should fetch all appointments when query is not provided", async () => {
    const user = MakeUser({});
    inMemoryUsersRepository.items.push(user);
  
    for (let i = 0; i < 10; i++) {
      inMemoryAppointmentsRepository.items.push(MakeAppointment({
        userId: user.id,
        description: `appointment ${i}`
      }));
  
      inMemoryAppointmentsRepository.items.push(MakeAppointment({
        userId: user.id
      }));
    }
  
    const result = await sut.execute({ query : '', page: 1 }); // sem query
  
    expect(isRight(result)).toBeTruthy();
    if (isRight(result)) {
      expect(unwrapEither(result).appointments).toHaveLength(20);
      expect(unwrapEither(result).appointments[0].userId).toEqual(user.id);
    }
  });
  


});
