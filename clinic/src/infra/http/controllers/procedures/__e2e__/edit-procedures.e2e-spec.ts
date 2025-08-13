import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { AppModule } from 'src/app.module'
import { DatabaseModule } from 'src/infra/database/database.module'
import { PrismaService } from 'src/infra/database/prisma/prisma.service'
import request from 'supertest'
import { AppointmentFactory } from 'test/factories/make-appointment'
import { MakeProcedure, ProcedureFactory } from 'test/factories/make-procedure'
import { UserFactory } from 'test/factories/make-user'
import { describe, it, expect } from 'vitest'

describe('Get procedures by user id (E2E)', () => {
  let app: INestApplication
  let appointmentFactory: AppointmentFactory
  let userFactory: UserFactory
  let procedureFactory : ProcedureFactory
  let jwt: JwtService
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, AppointmentFactory, ProcedureFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    appointmentFactory = moduleRef.get(AppointmentFactory)
    userFactory = moduleRef.get(UserFactory)
    procedureFactory = moduleRef.get(ProcedureFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  it('[PATCH] /procedures', async () => {
    const admUser = await userFactory.makePrismaUser({
      name: 'admin',
    })

    const user = await userFactory.makePrismaUser({
      name: 'Otavio',
    })

    const access_token = jwt.sign({
      sub: user.id.toString(),
    })

    const appointment = await appointmentFactory.makePrismaAppointment({
      userId: user.id,
    })

    const procedure = await procedureFactory.makePrismaProcedure({
      userId : user.id,
      appointmentId : appointment.id,
      name : 'PREENCHIMENTO',
      product : 'Paraguay',
      region : 'HEAD',
      value : 1000
    })
    
    const result = await request(app.getHttpServer())
    .patch(`/procedures`)
    .send({
      procedureId : procedure.id.toString(),
      updatedBy : admUser.id.toString(),
      name : 'BOTOX',
      product : 'EUROPEAN',
      region : 'BODY',
      value : 1200
    })
    .set('Authorization', `Bearer ${access_token}`)


    expect(result.statusCode).toBe(200)

    const procedureInDatabase = await prisma.procedure.findFirst({
      where : {
        id: procedure.id.toString()
      }
    })

    expect(procedureInDatabase.name).toEqual('BOTOX')
    expect(procedureInDatabase.product).toEqual('EUROPEAN')
    expect(procedureInDatabase.region).toEqual('BODY')
    expect(procedureInDatabase.value).toEqual(1200)


  })
})
