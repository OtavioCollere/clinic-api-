import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
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

  it("[POST] /users", async () => {
    const result = await request(app.getHttpServer()).post('/users').send({
      name: 'John Doe',
      email: 'jondoe@email.com',
      password : 'jondoe123',
      sector : 'comercial'
    })

    expect(result.statusCode).toEqual(201)

    const userOnDatabase = await prisma.user.findUnique({
      where :{
        email : 'jondoe@email.com'
      }
    })

    expect(userOnDatabase.name).toEqual('John Doe')
    expect(result.body).toEqual({
      user : {
        id : userOnDatabase.id,
      }
    })
  })
})