import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { AppModule } from 'src/app.module'
import { DatabaseModule } from 'src/infra/database/database.module'
import { PrismaService } from 'src/infra/database/prisma/prisma.service'
import request from 'supertest'
import { AppointmentFactory } from 'test/factories/make-appointment'
import { UserFactory } from 'test/factories/make-user'
import { describe, it, expect } from 'vitest'

describe('Reschedule appointment (E2E)', () => {
  let app: INestApplication
  let appointmentFactory: AppointmentFactory
  let userFactory: UserFactory
  let jwt: JwtService
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, AppointmentFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    appointmentFactory = moduleRef.get(AppointmentFactory)
    userFactory = moduleRef.get(UserFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  it('[PATCH] /appointments/reschedule', async () => {
    const user = await userFactory.makePrismaUser({
      name: 'Otavio',
    })

    const access_token = jwt.sign({
      sub: user.id.toString(),
    })

    const appointment = await appointmentFactory.makePrismaAppointment({
      userId: user.id,
      name: 'Consulta inicial',
      duration: 30,
      dateHour: new Date(Date.now() + 60 * 60 * 1000), // 1h no futuro
    })

    const newDate = new Date(Date.now() + 2 * 60 * 60 * 1000) // 2h no futuro

    const result = await request(app.getHttpServer())
      .patch('/appointments/reschedule')
      .send({
        appointmentId: appointment.id.toString(),
        userId: user.id.toString(),
        name: 'Consulta reagendada',
        duration: 45,
        description: 'Paciente pediu novo horário',
        dateHour: newDate.toISOString(),
      })
      .set('Authorization', `Bearer ${access_token}`)

    expect(result.statusCode).toEqual(200)

    const updatedAppointment = await prisma.appointment.findUnique({
      where: {
        id: appointment.id.toString(),
      },
    })

    expect(updatedAppointment.status).toEqual('RESCHEDULED') // ou 'PENDING' dependendo da lógica do seu sistema
    expect(updatedAppointment.name).toEqual('Consulta reagendada')
    expect(new Date(updatedAppointment.dateHour).getTime()).toEqual(newDate.getTime())
  })
})
