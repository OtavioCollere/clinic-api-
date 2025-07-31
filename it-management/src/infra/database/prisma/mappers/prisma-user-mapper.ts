import { User as PrismaUser, type Prisma } from '@prisma/client'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'
import { User } from 'src/domain/management/enterprise/entities/user'

export class PrismaUserMapper {
  static toDomain(raw: PrismaUser) : User {
    return User.create({
      name : raw.name,
      email : raw.email,
      sector : raw.sector,
      password : raw.password,
      updatedAt : raw.updatedAt,
      createdAt : raw.createdAt
    }, new UniqueEntityID(raw.id) )
  }

  static toPrisma(user : User) : Prisma.UserUncheckedCreateInput {
    return {
      id : user.id.toString(),
      name : user.name,
      email : user.email,
      sector: user.sector,
      password : user.password,
      updatedAt : user.updatedAt,
      createdAt : user.createdAt
    }
  }
}
