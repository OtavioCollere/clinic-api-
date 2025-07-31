import { Injectable } from "@nestjs/common";
import { UsersRepository } from "src/domain/management/application/repositories/users-repository";
import { User } from "src/domain/management/enterprise/entities/user";
import { PrismaService } from "../prisma.service";
import { PrismaUserMapper } from "../mappers/prisma-user-mapper";

@Injectable()
export class PrismaUsersRepository implements UsersRepository{
  constructor(
    private prismaService : PrismaService
  ) {}
  
  async create(user: User): Promise<User> {
    const data = await PrismaUserMapper.toPrisma(user)  
    
    await this.prismaService.user.create({
        data
    })

    return user
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({
      where : {
        email 
      }
    })

    if (!user) return null
    
    return PrismaUserMapper.toDomain(user)
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({
      where: { 
        id
      }
    })

    if(!user) return null

    return PrismaUserMapper.toDomain(user)
  }

   async save(user: User): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user);

    await this.prismaService.user.update({
      data,
      where : {
        id : data.id
      }
    })

  }
  async delete(id: string): Promise<void> {
      await this.prismaService.user.delete({
        where : {
          id
        }
      })
  }
}