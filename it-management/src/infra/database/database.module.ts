import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { UsersRepository } from "src/domain/management/application/repositories/users-repository";
import { PrismaUsersRepository } from "./prisma/repositories/prisma-users-repositories";

@Module({
  providers : [
    PrismaService,
    {provide : UsersRepository, useClass : PrismaUsersRepository}
  ],
  exports : [
    PrismaService,
    
    UsersRepository
  ]
})
export class DatabaseModule{}