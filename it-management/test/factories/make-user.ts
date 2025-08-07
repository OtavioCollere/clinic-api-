import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { User, type UserProps } from "src/domain/management/enterprise/entities/user";
import { PrismaUserMapper } from "src/infra/database/prisma/mappers/prisma-user-mapper";
import { PrismaService } from "src/infra/database/prisma/prisma.service";

export function MakeUser(override : Partial<UserProps>, id? : string) {
  const user = User.create({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    sector: faker.commerce.department(),
    password: faker.internet.password(),
    ...override
  }, new UniqueEntityID(id))

  return user
}

@Injectable()
export class UserFactory{
  constructor(private prisma : PrismaService){}

  async makePrismaUser(data: Partial<UserProps> = {}): Promise<User> {
    const user = MakeUser(data);
    
    await this.prisma.user.create({
      data : PrismaUserMapper.toPrisma(user)
    });

    return user;
  }
}