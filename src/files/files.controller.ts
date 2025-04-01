import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/auth.guard';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileValidationPipe } from 'src/pipes/files-validation';

@Controller('/files')
export class FilesController {
  constructor(private filesService: FilesService) {}

  @Post('/upload')
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile(new FileValidationPipe())
    file: Express.Multer.File,
  ) {
    return this.filesService.uploadFile(file);
  }
}
