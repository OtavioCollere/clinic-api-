import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AppModule } from 'src/app.module'
import { PrismaService } from 'src/infra/database/prisma/prisma.service'
import request from 'supertest'

describe('Register User (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  it("[POST] /session", async () => {

    await prisma.user.create({
      data: {
        name : 'Otavio',
        email : 'otavio@email.com',
        password : 'otavio',
        sector : 'ti'
      }
    })

    const result = await request(app.getHttpServer()).post('/session').send({
      email : 'otavio@email.com',
      password : 'otavio',
    })

    expect(result.statusCode).toEqual(200)
    expect(result.body).toEqual({
      access_token: expect.any(String),
    })

  })

  it('[POST] /session (sad path - wrong credentials)', async () => {
    await prisma.user.create({
      data: {
        name: 'Otavio',
        email: 'otavio@email.com',
        password: 'otavio',
        sector: 'ti'
      }
    })

    const result = await request(app.getHttpServer()).post('/session').send({
      email: 'otavio@email.com',
      password: 'wrong-password',
    })

    expect(result.statusCode).toEqual(401)
  })

})