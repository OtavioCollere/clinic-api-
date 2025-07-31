import { Module } from "@nestjs/common";
import { JwtStrategy } from "./jwt-strategy";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import type { Env } from "../env/env";

@Module({
  imports : [
    PassportModule,
    JwtModule.registerAsync({
      global : true,
      imports : [ConfigModule],
      inject : [ConfigService],
      async useFactory(config : ConfigService<Env, true>) {
        const publicKey = config.get('PUBLIC_KEY', {infer : true})
        const privateKey = config.get('PRIVATE_KEY', {infer : true})

        return {
          signOptions : {algorithm : 'RS256'},
          privateKey : Buffer.from(privateKey, 'base64'),
          publicKey : Buffer.from(publicKey, 'base64'),
        }
      }
    })
  ],
  providers : [
    JwtStrategy,
    {provide : APP_GUARD, useClass : JwtAuthGuard}
  ],
})
export class AuthModule{}