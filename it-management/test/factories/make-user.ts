import { faker } from "@faker-js/faker/.";
import { User, type UserProps } from "src/domain/management/enterprise/entities/user";

export function MakeUser(override : Partial<UserProps>, id? : string) {
  const user = User.create({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    sector: faker.commerce.department(),
    password: faker.internet.password(),
    ...override
  }, id)

  return user
}