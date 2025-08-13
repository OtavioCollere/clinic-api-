import { Module } from "@nestjs/common";
import { JwtStrategy } from "./jwt-strategy";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { EnvModule } from "../env/env.module";
import { EnvService } from "../env/env.service";

@Module({
  imports : [
    PassportModule,
    JwtModule.registerAsync({
      global : true,
      imports : [EnvModule],
      inject : [EnvService],
      useFactory(env: EnvService) {
        const publicKey = env.get('PUBLIC_KEY')
        const privateKey = env.get('PRIVATE_KEY')

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
    EnvService,
    {provide : APP_GUARD, useClass : JwtAuthGuard}
  ],
})
export class AuthModule{}