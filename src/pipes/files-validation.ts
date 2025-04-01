import { Injectable } from '@nestjs/common';
import {
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
} from '@nestjs/common';

@Injectable()
export class FileValidationPipe extends ParseFilePipe {
  constructor() {
    super({
      validators: [
        new MaxFileSizeValidator({
          maxSize: 1024 * 1024 * 2,
          message: 'file must be 2mb or less',
        }),
        new FileTypeValidator({ fileType: 'image/(jpeg|png|gif)' }),
      ],
    });
  }
}
