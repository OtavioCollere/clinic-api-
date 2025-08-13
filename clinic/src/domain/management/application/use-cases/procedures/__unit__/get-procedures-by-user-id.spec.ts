

import { beforeEach, describe, it, expect } from 'vitest'
import { InMemoryProceduresRepository } from 'test/repositories/in-memory-procedures-repository'
import { InMemoryAppointmentsRepository } from 'test/repositories/in-memory-appointments-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { MakeUser } from 'test/factories/make-user'
import { MakeAppointment } from 'test/factories/make-appointment'
import { isRight, unwrapEither } from 'src/core/either/either'
import { GetProceduresByUserIdUseCase } from '../get-procedures-by-user-id'
import { MakeProcedure } from 'test/factories/make-procedure'


describe('Get Procedure by user id Use Case', () => {

  let sut : GetProceduresByUserIdUseCase
  let inMemoryProceduresRepository : InMemoryProceduresRepository
  let inMemoryAppointmentsRepository: InMemoryAppointmentsRepository;
  let inMemoryUsersRepository : InMemoryUsersRepository;

  beforeEach(() => {
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

    const fakeUser = MakeUser({
      name : "fake"
    })
    inMemoryUsersRepository.items.push(fakeUser)

    let userId = user.id; 
    for (let i = 1 ; i <= 10; i++)
    {

      if(i > 5)
      {
        userId = fakeUser.id
      }

      let createdAppointment = MakeAppointment({
        userId : userId,
        name : `procedure ${i}`
      })
      inMemoryAppointmentsRepository.items.push(createdAppointment)

      let createdProcedure = MakeProcedure({
        userId : userId,
        appointmentId : createdAppointment.id
      })
      inMemoryProceduresRepository.items.push(createdProcedure)

    }

    const result = await sut.execute({
      userId : userId.toString()
    })

    expect(isRight(result)).toBeTruthy()
    if(isRight(result)){
      console.log(unwrapEither(result).procedures.length);
      expect(unwrapEither(result).procedures.length).toEqual(5)
      expect(inMemoryProceduresRepository.items.length).toEqual(10)
    }


  })



})
