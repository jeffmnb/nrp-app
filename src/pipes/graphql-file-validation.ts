// pipe
import { Injectable, PipeTransform } from '@nestjs/common';
import { FileValidationPipe } from './files-validation';

@Injectable()
export class GraphQLFileValidationPipe implements PipeTransform {
  constructor(private fileValidationPipe: FileValidationPipe) {}

  async transform(value: any) {
    if (value && value.file) {
      const file = await value.file;
      const multerFile = {
        buffer: await file.createReadStream().toBuffer(),
        originalname: file.filename,
        mimetype: file.mimetype,
      } as Express.Multer.File;

      return this.fileValidationPipe.transform(multerFile);
    }
    return value;
  }
}
