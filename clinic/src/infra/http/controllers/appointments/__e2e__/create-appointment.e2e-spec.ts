import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { AppModule } from 'src/app.module'
import { DatabaseModule } from 'src/infra/database/database.module'
import { PrismaService } from 'src/infra/database/prisma/prisma.service'
import request from 'supertest'
import { AppointmentFactory } from 'test/factories/make-appointment'
import { UserFactory } from 'test/factories/make-user'
import {describe, it, expect} from 'vitest'

describe('Create appointmment (E2E)', () => {
  let app: INestApplication
  let appointmentFactory : AppointmentFactory
  let userFactory : UserFactory
  let jwt : JwtService
  let prisma : PrismaService

  let user: any
  let access_token: string


// precisa do login

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers : [UserFactory, AppointmentFactory]
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    appointmentFactory = moduleRef.get(AppointmentFactory)
    userFactory = moduleRef.get(UserFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  it("[POST] /appointments/", async () => {

    const user = await userFactory.makePrismaUser({
      name : 'Otavio'
    })

    const access_token = jwt.sign({
      sub: user.id.toString()
    })

    const result = await request(app.getHttpServer())
    .post('/appointments')
    .send({
      userId : user.id.toString(),
      name : 'Appointment Test',
      description : 'This is a test appointment',
      duration : 30,
      dateHour : '2025-08-07T14:30:00Z',
    })
    .set('Authorization', `Bearer ${access_token}`)

    expect(result.statusCode).toEqual(201)

    const appointmentOnDatabase = await prisma.appointment.findFirst({
      where : {
        name : 'Appointment Test',
      }
    })

    expect(appointmentOnDatabase).toBeDefined()
    expect(appointmentOnDatabase.duration).toEqual(30)
  })


})