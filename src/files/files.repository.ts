import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class FilesRepository {
  constructor(private prismaClient: PrismaClient) {}

  async uploadFile({ file, url }: { file: Express.Multer.File; url: string }) {
    await this.prismaClient.attachment.create({
      data: { title: file.originalname, url },
    });
  }
}
