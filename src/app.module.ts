import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaService } from './prisma/prisma.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { QuestionModule } from './question/question.module';
import { FilesModule } from './files/files.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { FilesResolver } from './files/graphql/files.resolver';
import { FileValidationPipe } from './pipes/files-validation';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      uploads: {
        maxFileSize: 10000000,
        maxFiles: 5,
      },
    }),
    UserModule,
    AuthModule,
    QuestionModule,
    FilesModule,
  ],
  providers: [PrismaService, FilesResolver, FileValidationPipe],
})
export class AppModule {}
