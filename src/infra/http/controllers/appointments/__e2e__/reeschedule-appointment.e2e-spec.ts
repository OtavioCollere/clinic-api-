import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { AppModule } from 'src/app.module'
import { DatabaseModule } from 'src/infra/database/database.module'
import { PrismaService } from 'src/infra/database/prisma/prisma.service'
import request from 'supertest'
import { AppointmentFactory } from 'test/factories/make-appointment'
import { UserFactory } from 'test/factories/make-user'
import { describe, it, expect, beforeAll, afterAll } from 'vitest'

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

  afterAll(async () => {
    await prisma.$disconnect()
    await app.close()
  })

  it('[PATCH] /appointments/:appointmentId/reschedule', async () => {
    const user = await userFactory.makePrismaUser({ name: 'Otavio' })

    const access_token = jwt.sign({
      sub: user.id.toString(),
    })

    // Cria um appointment pendente para ser reagendado
    // Usa uma data futura válida
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 1) // Amanhã
    
    const appointment = await appointmentFactory.makePrismaAppointment({
      userId: user.id,
      name: 'Original Name',
      description: 'Original description',
      duration: 30,
      dateHour: futureDate,
      status: 'PENDING', // Garante que o status seja PENDING
    })

    // Nova data também no futuro
    const newDate = new Date()
    newDate.setDate(newDate.getDate() + 2) // Depois de amanhã
    newDate.setHours(16, 0, 0, 0) // 16:00
    
    const newDuration = 45
    const newName = 'Updated Name'
    const newDescription = 'Updated description'

    console.log('Appointment ID:', appointment.id.toString())
    console.log('Original date:', futureDate.toISOString())
    console.log('New date:', newDate.toISOString())

    const requestBody = {
      updatedBy: user.id.toString(),
      userId: user.id.toString(),
      name: newName,
      description: newDescription,
      duration: newDuration,
      dateHour: newDate.toISOString(),
    }
    
    console.log('Request body:', requestBody)

    const result = await request(app.getHttpServer())
      .patch(`/appointments/${appointment.id.toString()}/reschedule`)
      .send(requestBody)
      .set('Authorization', `Bearer ${access_token}`)

    console.log('Response status:', result.statusCode)
    console.log('Response body:', JSON.stringify(result.body, null, 2))
    
    if (result.statusCode === 400) {
      console.log('Zod validation errors:', result.body.errors)
    }

    expect(result.statusCode).toEqual(200)

    const updated = await prisma.appointment.findUnique({
      where: { id: appointment.id.toString() },
    })

    expect(updated).toBeDefined()
    expect(updated?.name).toEqual(newName)
    expect(updated?.description).toEqual(newDescription)
    expect(updated?.duration).toEqual(newDuration)
    expect(updated?.updatedBy).toEqual(user.id.toString())
  })
})
