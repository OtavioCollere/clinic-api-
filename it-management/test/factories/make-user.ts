import { faker } from "@faker-js/faker";
<<<<<<< HEAD
=======
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
>>>>>>> ca0b63c0816296c500e6423e86674371abbd34b8
import { User, type UserProps } from "src/domain/management/enterprise/entities/user";

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