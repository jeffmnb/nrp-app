import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { PrismaClient } from '@prisma/client';
import { FilesRepository } from './files.repository';
import { S3Client } from '@aws-sdk/client-s3';

@Module({
  providers: [FilesService, PrismaClient, FilesRepository, S3Client],
  controllers: [FilesController],
  exports: [FilesRepository, FilesService],
})
export class FilesModule {}
