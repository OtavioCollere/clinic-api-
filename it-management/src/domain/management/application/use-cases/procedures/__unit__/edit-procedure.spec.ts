

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
import { MakeProcedure } from 'test/factories/make-procedure'


describe('Register Procedure Use Case', () => {

  let sut : RegisterProcedureUseCase
  let inMemoryProceduresRepository : InMemoryProceduresRepository
  let inMemoryAppointmentsRepository: InMemoryAppointmentsRepository
  let inMemoryUsersRepository : InMemoryUsersRepository;

  beforeAll(() => {
    inMemoryProceduresRepository = new InMemoryProceduresRepository();
    inMemoryAppointmentsRepository = new InMemoryAppointmentsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new RegisterProcedureUseCase(
      inMemoryProceduresRepository,
      inMemoryUsersRepository,
      inMemoryAppointmentsRepository
    )
  })

  it("should be able to register a procedure", async () => {

    const user = MakeUser({
      name : "Otavio"
    })
    inMemoryUsersRepository.items.push(user)

    const appointment = MakeAppointment({
      userId : user.id
    })
    inMemoryAppointmentsRepository.items.push(appointment);

    inMemoryProceduresRepository.items.push(MakeProcedure({
      userId : user.id,
      appointmentId : appointment.id
    }))

    const result = await sut.execute({
      procedureId : '',
      name : 'PREENCHIMENTO',
      value : 2500,
      product : 'Europe',
      region : 'BODY' 
    })

    expect(isRight(result)).toBeTruthy()
    if(isRight(result)){
      expect(unwrapEither(result).procedure.name).toEqual('PREENCHIMENTO')
      expect(unwrapEither(result).procedure.value).toEqual(2500)
      expect(unwrapEither(result).procedure.product).toEqual('Europe')
      expect(unwrapEither(result).procedure.region).toEqual('BODY')
 
    }
    
    }


  })

  it("should not be able to register procedure when user id not exists", async () => {
    const user = MakeUser({
      name : "Otavio"
    })
    inMemoryUsersRepository.items.push(user)

    const appointment = MakeAppointment({
      userId : user.id
    })
    inMemoryAppointmentsRepository.items.push(appointment)

    const result = await sut.execute({
      userId : 'fake id',
      appointmentId : appointment.id.toString(),
      name : 'BOTOX',
      product : 'PARAGUAY',
      region : 'HEAD',
      value : 1200
    })

    expect(isLeft(result)).toBeTruthy()
    expect(unwrapEither(result)).toBeInstanceOf(UserNotFoundError)
  })

  

})
