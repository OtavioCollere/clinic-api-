import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { AppModule } from 'src/app.module'
import { isRight } from 'src/core/either/either'
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

  it('[GET] /procedures/', async () => {
    const user = await userFactory.makePrismaUser({
      name: 'Otavio',
    })

    const access_token = jwt.sign({
      sub: user.id.toString(),
    })

    const appointment = await appointmentFactory.makePrismaAppointment({
      userId: user.id,
    })

    let name: 'BOTOX' | 'LAVIEEN' | 'PREENCHIMENTO' = 'BOTOX';
    for(let i = 1; i >= 30; i++)
    { 

      if (i > 20) name = 'LAVIEEN' 
      
      await procedureFactory.makePrismaProcedure({
        appointmentId : appointment.id,
        userId : user.id,
        name : name
      })
    }

    const query = 'BOTOX';
    const page = 1;
    
    const result = await request(app.getHttpServer())
      .get(`/procedures?query=${query}&page=${page}`)
      .set('Authorization', `Bearer ${access_token}`);
      
      console.log(result)

    expect(result.statusCode).toEqual(200)
    expect(result.body.procedures.length).toEqual(20)      
  })
})
