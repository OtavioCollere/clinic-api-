import { InMemoryAppointmentsRepository } from "test/repositories/in-memory-appointments-repository"
import { RescheduleAppointmentUseCase } from "../reschedule-appointment"
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository"
import { MakeAppointment } from "test/factories/make-appointment"
import { MakeUser } from "test/factories/make-user"
import { isRight, unwrapEither } from "src/core/either/either"
import { describe, beforeEach, it, expect } from "vitest"

describe("Reschedule appointment use case unit tests", () => {

  let sut: RescheduleAppointmentUseCase
  let inMemoryAppointmentsRepository: InMemoryAppointmentsRepository
  let inMemoryUsersRepository : InMemoryUsersRepository

  beforeEach(() => {
    inMemoryAppointmentsRepository = new InMemoryAppointmentsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new RescheduleAppointmentUseCase(inMemoryAppointmentsRepository, inMemoryUsersRepository);
  })

  it("should be able to reeschedule an appointment", async () => {

    const customer = MakeUser({
      name : 'pacitente'
    })
    inMemoryUsersRepository.items.push(customer)

    const user = MakeUser({
      name : 'Otavio'
    })
    inMemoryUsersRepository.items.push(user)

    const appointment = MakeAppointment({
      userId : user.id,
      name : 'fake appointment',
      dateHour: new Date('2025-08-08T10:00:00'),
      duration : 30
    })
    inMemoryAppointmentsRepository.items.push(appointment)

    const result = await sut.execute({
      userId : customer.id.toString(),
      appointmentId : appointment.id.toString(),
      dateHour: new Date('2025-12-12T10:00:00'),
      updatedBy : user.id.toString(),
      duration : 60
    });

    expect(isRight(result)).toBeTruthy()
    if(isRight(result)){
      expect(inMemoryAppointmentsRepository.items[0].duration).toEqual(60)
      expect(inMemoryAppointmentsRepository.items[0].updatedBy).toEqual(user.id.toString())
      expect(unwrapEither(result).appointment.dateHour).toEqual(new Date('2025-12-12T10:00:00'))
    }

  })

})