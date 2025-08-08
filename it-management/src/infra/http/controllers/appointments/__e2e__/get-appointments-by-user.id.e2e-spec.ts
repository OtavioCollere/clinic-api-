import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import { AppModule } from 'src/app.module'
import { DatabaseModule } from 'src/infra/database/database.module'
import request from 'supertest'
import { AppointmentFactory } from 'test/factories/make-appointment'
import { MakeUser, UserFactory } from 'test/factories/make-user'
import {describe, it, expect} from 'vitest'

describe('Get appointments by user id (E2E)', () => {
  let app: INestApplication
  let userFactory : UserFactory
  let appointmentFactory : AppointmentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers : [UserFactory, AppointmentFactory]
    }).compile()

    app = moduleRef.createNestApplication()

    appointmentFactory = moduleRef.get(AppointmentFactory)
    userFactory = moduleRef.get(UserFactory)

    await app.init()
  })

  it("[GET] /appointments/:userId", async () => {

    const user = await userFactory.makePrismaUser({
      name : 'Otavio'
    })

    for (let i = 0; i <= 3; i++)
      await appointmentFactory.makeAppointment({
        userId: user.id,
        description : `desc ${i}`
      })
    {}

    const result = await request(app.getHttpServer()).get(`/appointments/${user.id}`).send({})

    expect(result.statusCode).toEqual(200)
    expect(result.body.appointments).toHaveLength(4)
  })

  it("[GET] /appointments/:userId - USER NOT FOUND", async () => {

    const result = await request(app.getHttpServer()).get(`/appointments/${'non-existent-id'}`).send({})

    expect(result.statusCode).toEqual(400)
  })


})