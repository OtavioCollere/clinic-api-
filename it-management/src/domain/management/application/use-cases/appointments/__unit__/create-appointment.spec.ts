import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository"
import { CreateAppointmentUseCase } from "../create-appointment"
import { InMemoryAppointmentsRepository } from "test/repositories/in-memory-appointments-repository"
import { describe, beforeEach, it, expect } from "vitest"
import { MakeUser } from "test/factories/make-user"
import { isLeft, isRight, unwrapEither } from "src/core/either/either"
import { UserNotFoundError } from "src/core/errors/user-not-found-error"
import { InvalidIntervalError } from "src/core/errors/invalid-interval-error"
import { MakeAppointment } from "test/factories/make-appointment"


describe("Create appointment use case unit tests", () => {

  let sut: CreateAppointmentUseCase
  let inMemoryAppointmentsRepository: InMemoryAppointmentsRepository
  let inMemoryUsersRepository : InMemoryUsersRepository

  beforeEach(() => {
    inMemoryAppointmentsRepository = new InMemoryAppointmentsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new CreateAppointmentUseCase(inMemoryAppointmentsRepository, inMemoryUsersRepository);
  })

  it("should be able to register an appointment", async () => {

    const user = MakeUser({
      name : 'Otavio'
    })
    inMemoryUsersRepository.items.push(user)

    const result = await sut.execute({
      userId : user.id.toString(),
      name : 'Retorno Botox',
      duration : 60, // 60 minutos,
      dateHour : new Date(),
      description : 'Paciente retornando após 15 dias'
    })

    expect(isRight(result)).toBeTruthy()
    if(isRight(result)){
      expect(inMemoryAppointmentsRepository.items[0].userId.toString()).toEqual(user.id.toString())
      expect(inMemoryAppointmentsRepository.items[0].duration).toEqual(60)
      expect(unwrapEither(result).appointment)
    }
  })

  it("should not be able to register an appointment with non-existent user", async () => {

    const result = await sut.execute({
      userId : 'non-existent',
      name : 'Retorno Botox',
      duration : 60, // 60 minutos,
      dateHour : new Date(),
      description : 'Paciente retornando após 15 dias'
    })

    expect(isLeft(result)).toBeTruthy()
    expect(unwrapEither(result)).toBeInstanceOf(UserNotFoundError)
})

  it("should not be able to register an appointment in the same hour of existent appointment", async () => {

    const user = MakeUser({
      name : 'Otavio'
    })
    inMemoryUsersRepository.items.push(user)

    inMemoryAppointmentsRepository.items.push(MakeAppointment({
      dateHour : new Date('2025-12-12T10:00:00')
    }))

    const result = await sut.execute({
      userId : user.id.toString(),
      name : 'Retorno Botox',
      duration : 60, // 60 minutos,
      dateHour : new Date('2025-12-12T10:00:00'),
      description : 'Paciente retornando após 15 dias'
    })

    expect(isLeft(result)).toBeTruthy()
    expect(unwrapEither(result)).toBeInstanceOf(InvalidIntervalError)
  })

})