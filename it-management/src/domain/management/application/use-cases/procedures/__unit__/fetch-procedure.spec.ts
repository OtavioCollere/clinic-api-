import { beforeEach, describe, it, expect } from 'vitest'
import { FetchProceduresUseCase } from '../fetch-procedures'
import { InMemoryProceduresRepository } from 'test/repositories/in-memory-procedures-repository'
import { InMemoryAppointmentsRepository } from 'test/repositories/in-memory-appointments-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { MakeUser } from 'test/factories/make-user'
import { MakeAppointment } from 'test/factories/make-appointment'
import { MakeProcedure } from 'test/factories/make-procedure'
import { isRight, unwrapEither } from 'src/core/either/either'

describe("Fetch procedures unit tests", () => {

  let sut: FetchProceduresUseCase
  let inMemoryProceduresRepository : InMemoryProceduresRepository
  let inMemoryAppointmentsRepository: InMemoryAppointmentsRepository;
  let inMemoryUsersRepository : InMemoryUsersRepository;

  
  beforeEach(() => {
    inMemoryProceduresRepository = new InMemoryProceduresRepository();
    inMemoryAppointmentsRepository = new InMemoryAppointmentsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new FetchProceduresUseCase(
      inMemoryProceduresRepository,
    )
  })

  it("should be able to fetch procedures with paginate", async () => {

    const user = MakeUser({})
    const appointment = MakeAppointment({})

    for(let i = 1; i <= 30; i++)
    {
      let procedures = MakeProcedure({
        userId : user.id,
        appointmentId : appointment.id
      })

      inMemoryProceduresRepository.items.push(procedures)
    }
    
    const result = await sut.execute({query : '', page : 1})
    
    expect(isRight(result)).toBeTruthy()
    if(isRight(result)){
      expect(unwrapEither(result).procedures.length).toEqual(20)
    }
    
  })

  
  it("should be able to fetch procedures with search", async () => {

    const user = MakeUser({})
    const appointment = MakeAppointment({})

    let customName
    for(let i = 1; i <= 30; i++)
    {

      if(i <= 15)
      {
        customName = 'BOTOX'
      } else {
        customName = 'LAVIEEN'
      }

      let procedures = MakeProcedure({
        name : customName,
        userId : user.id,
        appointmentId : appointment.id,
      })

      inMemoryProceduresRepository.items.push(procedures)
    }
    
    const result = await sut.execute({query : 'BOTOX', page : 1})
    
    expect(isRight(result)).toBeTruthy()
    if(isRight(result)){
      expect(unwrapEither(result).procedures.length).toEqual(15)
      expect(inMemoryProceduresRepository.items.length).toEqual(30)
    }
    
  })
})