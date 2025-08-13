import { Injectable, type OnModuleDestroy, type OnModuleInit } from "@nestjs/common";
import { PrismaClient } from '@prisma/client'


@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy, OnModuleInit{
  constructor() {
    super({
      log: ['warn', 'error']
    })
  }
  
  onModuleDestroy() {
    return this.$connect
  }
  onModuleInit() {
    return this.$disconnect
  }
  
}