import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Env } from './infra/env/env';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get<ConfigService<Env, true>>(ConfigService)

  const port = configService.get('PORT', { infer : true })

  const config = new DocumentBuilder()
  .addBearerAuth()
  .setTitle('Clinic API')
  .setDescription('Clinic API Documentation')
  .setVersion('1.0')
  .build();
  
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);

  await app.listen(port);
}
bootstrap();
