

import { beforeEach, describe, it, expect } from 'vitest'
import { RegisterProcedureUseCase } from '../register-procedure'
import { InMemoryProceduresRepository } from 'test/repositories/in-memory-procedures-repository'
import { InMemoryAppointmentsRepository } from 'test/repositories/in-memory-appointments-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { MakeUser } from 'test/factories/make-user'
import { MakeAppointment } from 'test/factories/make-appointment'
import { isLeft, isRight, unwrapEither } from 'src/core/either/either'
import { UserNotFoundError } from 'src/core/errors/user-not-found-error'
import { AppointmentNotFoundError } from 'src/core/errors/appointment-not-found-error'
import { GetProceduresByUserIdUseCase } from '../get-procedures-by-user-id'


describe('Get Procedure by user id Use Case', () => {

  let sut : GetProceduresByUserIdUseCase
  let inMemoryProceduresRepository : InMemoryProceduresRepository
  let inMemoryAppointmentsRepository: InMemoryAppointmentsRepository;
  let inMemoryUsersRepository : InMemoryUsersRepository;

  beforeAll(() => {
    inMemoryProceduresRepository = new InMemoryProceduresRepository();
    inMemoryAppointmentsRepository = new InMemoryAppointmentsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new GetProceduresByUserIdUseCase(
      inMemoryProceduresRepository,
    )
  })

  it("should not be able to get procedures by user id", async () => {
    const user = MakeUser({
      name : "Otavio"
    })
    inMemoryUsersRepository.items.push(user)



    for (let i = 0 ; i <= 5; i++)
    {
      let createdAppointment = MakeAppointment({
        userId : user.id,
      })
      inMemoryAppointmentsRepository.create()
    }

  })



})
