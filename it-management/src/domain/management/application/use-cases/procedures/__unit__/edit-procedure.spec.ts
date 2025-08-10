import { beforeEach, describe, it, expect } from 'vitest'
import { EditProcedureUseCase } from '../edit-procedure'
import { InMemoryProceduresRepository } from 'test/repositories/in-memory-procedures-repository'
import { InMemoryAppointmentsRepository } from 'test/repositories/in-memory-appointments-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { MakeUser } from 'test/factories/make-user'
import { MakeAppointment } from 'test/factories/make-appointment'
import { MakeProcedure } from 'test/factories/make-procedure'
import { isLeft, isRight, unwrapEither } from 'src/core/either/either'
import { UserNotFoundError } from 'src/core/errors/user-not-found-error'
import { AppointmentNotFoundError } from 'src/core/errors/appointment-not-found-error'
import { ProcedureNotFoundError } from 'src/core/errors/procedure-not-found-error'

describe('Edit Procedure Use Case', () => {
  let sut: EditProcedureUseCase
  let inMemoryProceduresRepository: InMemoryProceduresRepository
  let inMemoryAppointmentsRepository: InMemoryAppointmentsRepository
  let inMemoryUsersRepository: InMemoryUsersRepository

  beforeEach(() => {
    inMemoryProceduresRepository = new InMemoryProceduresRepository()
    inMemoryAppointmentsRepository = new InMemoryAppointmentsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()

    sut = new EditProcedureUseCase(
      inMemoryProceduresRepository,
      inMemoryUsersRepository,
      inMemoryAppointmentsRepository
    )
  })

  it('should be able to edit a procedure', async () => {
    const updaterUser = MakeUser({ name: 'Eunice' })
    inMemoryUsersRepository.items.push(updaterUser)

    const user = MakeUser({ name: 'Otavio' })
    inMemoryUsersRepository.items.push(user)

    const appointment = MakeAppointment({ userId: user.id })
    inMemoryAppointmentsRepository.items.push(appointment)

    const procedure = MakeProcedure({
      userId: user.id,
      appointmentId: appointment.id
    })
    inMemoryProceduresRepository.items.push(procedure)

    const result = await sut.execute({
      procedureId: procedure.id.toString(),
      updatedBy : updaterUser.id.toString(),
      name: 'PREENCHIMENTO',
      value: 2500,
      product: 'Europe',
      region: 'BODY'
    })

    expect(isRight(result)).toBeTruthy()
    if(isRight(result))
    {
      const updated = unwrapEither(result).procedure;
      expect(updated.name).toBe('PREENCHIMENTO')
      expect(updated.value).toBe(2500)
      expect(updated.product).toBe('Europe')
      expect(updated.region).toBe('BODY')
    }
  })

  it('should not be able to edit with non-existing procedure', async () => {
    const updaterUser = MakeUser({ name: 'Eunice' })
    inMemoryUsersRepository.items.push(updaterUser)

    const result = await sut.execute({
      updatedBy : updaterUser.id.toString(),
      procedureId: 'non-existent',
      name: 'PREENCHIMENTO'
    })

    expect(isLeft(result)).toBeTruthy()
    expect(unwrapEither(result as any)).toBeInstanceOf(ProcedureNotFoundError)
  })

  it('should not be able to edit to non-existent user (customer)', async () => {
    const updaterUser = MakeUser({ name: 'Eunice' })
    inMemoryUsersRepository.items.push(updaterUser)

    const user = MakeUser({ name: 'Otavio' })
    inMemoryUsersRepository.items.push(user)

    const appointment = MakeAppointment({ userId: user.id })
    inMemoryAppointmentsRepository.items.push(appointment)

    const procedure = MakeProcedure({
      userId: user.id,
      appointmentId: appointment.id
    })
    inMemoryProceduresRepository.items.push(procedure)

    const result = await sut.execute({
      updatedBy : updaterUser.id.toString(),
      procedureId: procedure.id.toString(),
      userId: 'non-existent'
    })

    expect(isLeft(result)).toBeTruthy()
    expect(unwrapEither(result as any)).toBeInstanceOf(UserNotFoundError)
  })

  it('should not be able to edit to non-existent appointment', async () => {
    const updaterUser = MakeUser({ name: 'Eunice' })
    inMemoryUsersRepository.items.push(updaterUser)

    const user = MakeUser({ name: 'Otavio' })
    inMemoryUsersRepository.items.push(user)

    const appointment = MakeAppointment({ userId: user.id })
    inMemoryAppointmentsRepository.items.push(appointment)

    const procedure = MakeProcedure({
      userId: user.id,
      appointmentId: appointment.id
    })
    inMemoryProceduresRepository.items.push(procedure)

    const result = await sut.execute({
      updatedBy: updaterUser.id.toString(),
      procedureId: procedure.id.toString(),
      appointmentId: 'non-existent'
    })

    expect(isLeft(result)).toBeTruthy()
    expect(unwrapEither(result as any)).toBeInstanceOf(AppointmentNotFoundError)
  })
})
