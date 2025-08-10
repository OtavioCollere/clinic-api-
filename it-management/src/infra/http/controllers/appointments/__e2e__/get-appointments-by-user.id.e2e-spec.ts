import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { AppModule } from 'src/app.module'
import { DatabaseModule } from 'src/infra/database/database.module'
import request from 'supertest'
import { AppointmentFactory } from 'test/factories/make-appointment'
import { UserFactory } from 'test/factories/make-user'
import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest'

describe('Get appointments by user id (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let appointmentFactory: AppointmentFactory
  let jwt: JwtService

  let user: any
  let access_token: string

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, AppointmentFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    await app.init()

    // pegue os providers DEPOIS do init
    appointmentFactory = app.get(AppointmentFactory)
    userFactory = app.get(UserFactory)
    jwt = app.get(JwtService) // garante que vem do grafo real
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    user = await userFactory.makePrismaUser({ name: 'Otavio' })

    access_token = jwt.sign({
      sub: user.id.toString(),
    })
  })

  it('[GET] /appointments/:userId', async () => {

    for (let i = 0; i < 4; i++) {
      await appointmentFactory.makePrismaAppointment({
        userId: user.id,
        description: `desc ${i}`,
      })
    }

    const result = await request(app.getHttpServer())
      .get(`/appointments/${user.id}`)
      .set('Authorization', `Bearer ${access_token}`)

    expect(result.statusCode).toBe(200)
    expect(result.body.appointments).toHaveLength(4)
  })

  it('[GET] /appointments/:userId - USER NOT FOUND', async () => {
    // precisa mandar o token senão cai no guard e vira 401
    const result = await request(app.getHttpServer())
      .get('/appointments/non-existent-id')
      .set('Authorization', `Bearer ${access_token}`)

    // aqui você decide: se seu controller trata como 400, assert 400.
    expect(result.statusCode).toBe(400)
  })
})
