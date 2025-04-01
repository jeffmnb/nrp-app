import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FilesRepository } from './files.repository';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

@Injectable()
export class FilesService {
  private bucketName: string;
  private s3Client: S3Client;

  constructor(
    private filesRepository: FilesRepository,
    private configService: ConfigService,
  ) {
    this.bucketName = this.configService.get<string>('AWS_S3_BUCKET');

    this.s3Client = new S3Client({
      region: this.configService.get<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
      },
    });
  }

  async uploadFile(file: Express.Multer.File) {
    const fileName = file?.originalname?.split('.')?.[0];
    console.log('this.bucketName: ', this.bucketName);

    const filePayload = {
      Bucket: this.bucketName,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    return await this.s3Client
      .send(new PutObjectCommand(filePayload))
      .then(() => {
        const publicUrl = `https://${this.bucketName}.s3.amazonaws.com/${fileName}`;
        this.filesRepository.uploadFile({ file, url: publicUrl });
        return publicUrl;
      })
      .catch((err) => {
        throw new Error(err);
      });
  }
}
