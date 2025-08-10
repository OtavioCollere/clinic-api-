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

  it("[POST] /appointments/confirm", async () => {

    const user = await userFactory.makePrismaUser({
      name : 'Otavio'
    })

    const access_token = jwt.sign({
      sub: user.id.toString()
    })

    const appointment = await appointmentFactory.makePrismaAppointment({
      userId : user.id
    })

    const result = await request(app.getHttpServer())
    .patch('/appointments/confirm')
    .send({
      appointmentId : appointment.id.toString(),
      updatedBy : user.id.toString()
    })
    .set('Authorization', `Bearer ${access_token}`)

    expect(result.statusCode).toEqual(200)

    const confirmedAppointment = await prisma.appointment.findUnique({
      where : {
        id : appointment.id.toString()
      }
    })

    expect(confirmedAppointment.status).toEqual('CONFIRMED')

  })


})