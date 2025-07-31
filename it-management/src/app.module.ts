import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './infra/env/env';
import { HttpModule } from './infra/http/http.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate : (env) => envSchema.parse(env),
      isGlobal : true
    }),
    HttpModule
  ],
  controllers: [AppController],
  providers: [
    
    AppService,

  ],
})
export class AppModule {}
