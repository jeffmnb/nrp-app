import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidateDtoPipe } from './pipes/validate-request';
import { graphqlUploadExpress } from 'graphql-upload-minimal';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidateDtoPipe());
  app.use(graphqlUploadExpress());
  await app.listen(process.env.PORT ?? 3333);
}
bootstrap();
