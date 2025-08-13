import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { InMemoryAppointmentsRepository } from "test/repositories/in-memory-appointments-repository";
import { describe, beforeEach, it, expect } from "vitest";
import { MakeUser } from "test/factories/make-user";
import { MakeAppointment } from "test/factories/make-appointment";
import { isLeft, isRight, unwrapEither } from "src/core/either/either";
import { UserNotFoundError } from "src/core/errors/user-not-found-error";
import { AppointmentNotFoundError } from "src/core/errors/appointment-not-found-error";
import { CancelAppointmentUseCase } from "../cancel-appointment";

describe("Cancel appointment use case unit tests", () => {
  let sut: CancelAppointmentUseCase;
  let inMemoryAppointmentsRepository: InMemoryAppointmentsRepository;
  let inMemoryUsersRepository: InMemoryUsersRepository;

  beforeEach(() => {
    inMemoryAppointmentsRepository = new InMemoryAppointmentsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new CancelAppointmentUseCase(
      inMemoryAppointmentsRepository,
      inMemoryUsersRepository
    );
  });

  it("should be able to cancel an appointment", async () => {
    const user = MakeUser({
      name: "Otavio",
    });
    inMemoryUsersRepository.items.push(user);

    const appointment = MakeAppointment({});
    inMemoryAppointmentsRepository.items.push(appointment);

    const result = await sut.execute({
      appointmentId: appointment.id.toString(),
      updatedBy: user.id.toString(),
    });

    expect(isRight(result)).toBeTruthy();
    if (isRight(result)) {
      expect(unwrapEither(result).appointment.status).toBe('CANCELED');
    }
  });

  it("should not be able to cancel a non-existent appointment", async () => {
    const user = MakeUser({
      name: "Otavio",
    });
    inMemoryUsersRepository.items.push(user);

    const result = await sut.execute({
      appointmentId: "non-existent",
      updatedBy: user.id.toString(),
    });

    expect(isLeft(result)).toBeTruthy();
    expect(unwrapEither(result)).toBeInstanceOf(AppointmentNotFoundError);
  });

  it("should not be able to cancel an appointment with a non-existent user", async () => {
    const appointment = MakeAppointment({});
    inMemoryAppointmentsRepository.items.push(appointment);

    const result = await sut.execute({
      appointmentId: appointment.id.toString(),
      updatedBy: "non-existent",
    });

    expect(isLeft(result)).toBeTruthy();
    expect(unwrapEither(result)).toBeInstanceOf(UserNotFoundError);
  });
});
