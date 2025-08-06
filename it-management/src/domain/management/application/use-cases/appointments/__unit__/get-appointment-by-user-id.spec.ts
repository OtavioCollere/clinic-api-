import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { InMemoryAppointmentsRepository } from "test/repositories/in-memory-appointments-repository";
import { describe, beforeEach, it, expect } from "vitest";
import { MakeUser } from "test/factories/make-user";
import { MakeAppointment } from "test/factories/make-appointment";
import { isLeft, unwrapEither } from "src/core/either/either";
import { AppointmentFoundError } from "src/core/errors/appointment-not-found-error";
import { GetAppointmentsUseCaseByUserId } from "../get-appointments-by-user-id";

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

      
  });

  it("should not be able to confirm a non-existent appointment", async () => {
    const user = MakeUser({
      name: "Otavio",
    });
    inMemoryUsersRepository.items.push(user);

    const result = await sut.execute({
      appointmentId: "non-existent",
      updatedBy: user.id.toString(),
    });

    expect(isLeft(result)).toBeTruthy();
    expect(unwrapEither(result)).toBeInstanceOf(AppointmentFoundError);
  });


});
