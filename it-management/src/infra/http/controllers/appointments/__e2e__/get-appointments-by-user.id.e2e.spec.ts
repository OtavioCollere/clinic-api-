import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import { AppModule } from 'src/app.module'
import { DatabaseModule } from 'src/infra/database/database.module'
import request from 'supertest'
import { MakeUser, UserFactory } from 'test/factories/make-user'
import {describe, it, expect} from 'vitest'

describe('Authenticate User (E2E)', () => {
  let app: INestApplication
  let userFactory : UserFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers : [UserFactory]
    }).compile()

    app = moduleRef.createNestApplication()

    userFactory = moduleRef.get(UserFactory)

    await app.init()
  })

  it("[POST] /session", async () => {

    await userFactory.makePrismaUser({
      name : 'Otavio',
      email : 'otavio@email.com',
      password : await hash('otavio', 6),
      sector : 'ti'
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


})