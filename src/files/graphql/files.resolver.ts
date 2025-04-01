import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FilesService } from '../files.service';
import { FileUpload, GraphQLUpload } from 'graphql-upload-minimal';
import { ReadStream } from 'fs';

@Resolver(() => File)
export class FilesResolver {
  constructor(private filesService: FilesService) {}

  @Mutation(() => String)
  async uploadFile(
    @Args({ name: 'file', type: () => GraphQLUpload }) file: FileUpload,
  ): Promise<string> {
    const buffer = await this.streamToBuffer(file.createReadStream());

    const fileData = {
      buffer,
      originalname: file.filename,
      mimetype: file.mimetype,
    } as Express.Multer.File;

    return this.filesService.uploadFile(fileData);
  }

  private async streamToBuffer(readStream: ReadStream): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];

      readStream.on('data', (chunk: Buffer) => {
        chunks.push(chunk);
      });

      readStream.on('end', () => {
        resolve(Buffer.concat(chunks));
      });

      readStream.on('error', reject);
    });
  }

  @Query(() => String)
  getFile() {
    return '';
  }
}
