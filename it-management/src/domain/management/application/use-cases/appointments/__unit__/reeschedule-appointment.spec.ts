import { describe, it, beforeEach, expect } from "vitest";
import { InMemoryAppointmentsRepository } from "test/repositories/in-memory-appointments-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { MakeUser } from "test/factories/make-user";
import { MakeAppointment } from "test/factories/make-appointment";
import { isRight, isLeft, unwrapEither } from "src/core/either/either";
import { RescheduleAppointmentUseCase } from "../reschedule-appointment";
import { StatusIsNotPedingError } from "src/core/errors/status-is-not-peding-error";
import { AppointmentNotFoundError } from "src/core/errors/appointment-not-found-error";
import { EditorUserFoundError } from "src/core/errors/editor-user-not-found-error";
import { UserNotFoundError } from "src/core/errors/user-not-found-error";
import { InvalidDateError } from "src/core/errors/invalid-date-error";
import { InvalidIntervalError } from "src/core/errors/invalid-interval-error";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";

describe("RescheduleAppointmentUseCase unit tests", () => {
  let sut: RescheduleAppointmentUseCase;
  let appointmentsRepository: InMemoryAppointmentsRepository;
  let usersRepository: InMemoryUsersRepository;

  beforeEach(() => {
    appointmentsRepository = new InMemoryAppointmentsRepository();
    usersRepository = new InMemoryUsersRepository();
    sut = new RescheduleAppointmentUseCase(appointmentsRepository, usersRepository);
  });

  it("should reschedule an appointment successfully", async () => {
    const user = MakeUser({});
    const editor = MakeUser({});
    usersRepository.items.push(user, editor);

    const appointment = MakeAppointment({
      userId: user.id,
      dateHour: new Date(Date.now() + 60 * 60 * 1000), // 1 hora no futuro
    });

    appointmentsRepository.items.push(appointment);

    const result = await sut.execute({
      appointmentId: appointment.id.toString(),
      updatedBy: editor.id.toString(),
      userId: user.id.toString(),
      name: "Updated Name",
      description: "Updated Description",
      duration: 60,
      dateHour: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 horas no futuro
    });

    expect(isRight(result)).toBeTruthy();
    if (isRight(result)) {
      const updated = unwrapEither(result).appointment;
      expect(updated.name).toBe("Updated Name");
      expect(updated.description).toBe("Updated Description");
      expect(updated.duration).toBe(60);
    }
  });

  it("should fail if appointment does not exist", async () => {
    const result = await sut.execute({
      appointmentId: "non-existent-id",
      updatedBy: "any-editor",
      userId: "any-user",
      duration: 30,
      dateHour: new Date(Date.now() + 60 * 60 * 1000),
    });

    expect(isLeft(result)).toBeTruthy();
    if (isLeft(result)) {
      expect(result.left).toBeInstanceOf(AppointmentNotFoundError);
    }
  });

  it("should fail if appointment is not pending", async () => {
    const user = MakeUser({});
    const editor = MakeUser({});
    usersRepository.items.push(user, editor);

    const appointment = MakeAppointment({
      userId: user.id,
      status: "CANCELED", // força o erro
      dateHour: new Date(Date.now() + 60 * 60 * 1000),
    });

    appointmentsRepository.items.push(appointment);

    const result = await sut.execute({
      appointmentId: appointment.id.toString(),
      updatedBy: editor.id.toString(),
      userId: user.id.toString(),
      duration: 30,
      dateHour: new Date(Date.now() + 2 * 60 * 60 * 1000),
    });

    expect(isLeft(result)).toBeTruthy();
    if (isLeft(result)) {
      expect(result.left).toBeInstanceOf(StatusIsNotPedingError);
    }
  });

  it("should fail if editor user does not exist", async () => {
    const user = MakeUser({});
    usersRepository.items.push(user);

    const appointment = MakeAppointment({
      userId: user.id,
      dateHour: new Date(Date.now() + 60 * 60 * 1000),
    });

    appointmentsRepository.items.push(appointment);

    const result = await sut.execute({
      appointmentId: appointment.id.toString(),
      updatedBy: "non-existent-editor",
      userId: user.id.toString(),
      duration: 30,
      dateHour: new Date(Date.now() + 2 * 60 * 60 * 1000),
    });

    expect(isLeft(result)).toBeTruthy();
    if (isLeft(result)) {
      expect(result.left).toBeInstanceOf(EditorUserFoundError);
    }
  });

  it("should fail if user to be attended does not exist", async () => {
    const editor = MakeUser({});
    usersRepository.items.push(editor);

    const appointment = MakeAppointment({
      userId: new UniqueEntityID("non-existent-user"),
      dateHour: new Date(Date.now() + 60 * 60 * 1000),
    });

    appointmentsRepository.items.push(appointment);

    const result = await sut.execute({
      appointmentId: appointment.id.toString(),
      updatedBy: editor.id.toString(),
      userId: "non-existent-user",
      duration: 30,
      dateHour: new Date(Date.now() + 2 * 60 * 60 * 1000),
    });

    expect(isLeft(result)).toBeTruthy();
    if (isLeft(result)) {
      expect(result.left).toBeInstanceOf(UserNotFoundError);
    }
  });

  it("should fail if dateHour is in the past", async () => {
    const user = MakeUser({});
    const editor = MakeUser({});
    usersRepository.items.push(user, editor);

    const appointment = MakeAppointment({
      userId: user.id,
      dateHour: new Date(Date.now() + 60 * 60 * 1000),
    });

    appointmentsRepository.items.push(appointment);

    const result = await sut.execute({
      appointmentId: appointment.id.toString(),
      updatedBy: editor.id.toString(),
      userId: user.id.toString(),
      duration: 30,
      dateHour: new Date(Date.now() - 60 * 60 * 1000), // passado
    });

    expect(isLeft(result)).toBeTruthy();
    if (isLeft(result)) {
      expect(result.left).toBeInstanceOf(InvalidDateError);
    }
  });

  it("should fail if appointment interval overlaps with another", async () => {
    const user = MakeUser({});
    const editor = MakeUser({});
    usersRepository.items.push(user, editor);

    const conflictingAppointment = MakeAppointment({
      userId: user.id,
      dateHour: new Date(Date.now() + 2 * 60 * 60 * 1000),
      duration: 60,
    });

    const appointmentToEdit = MakeAppointment({
      userId: user.id,
      dateHour: new Date(Date.now() + 60 * 60 * 1000),
    });

    appointmentsRepository.items.push(conflictingAppointment, appointmentToEdit);

    const result = await sut.execute({
      appointmentId: appointmentToEdit.id.toString(),
      updatedBy: editor.id.toString(),
      userId: user.id.toString(),
      duration: 60,
      dateHour: conflictingAppointment.dateHour, // mesmo horário do já existente
    });

    expect(isLeft(result)).toBeTruthy();
    if (isLeft(result)) {
      expect(result.left).toBeInstanceOf(InvalidIntervalError);
    }
  });
});
