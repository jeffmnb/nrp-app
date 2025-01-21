import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidateDtoPipe } from './pipes/validate-request';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidateDtoPipe());
  await app.listen(process.env.PORT ?? 3333);
}
bootstrap();
