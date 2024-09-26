import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as sharp from 'sharp';
import * as fs from 'fs';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { v4 as uuidv4 } from 'uuid';
import { Multer } from 'multer';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);

  constructor(private readonly i18n: I18nService) {}

  async saveFile(path: string, file: Multer.File): Promise<string> {
    const lang = I18nContext.current().lang;
    const uniqueFilename = `${uuidv4()}-${Date.now()}.${file.mimetype.split('/')[1]}`;
    const destinationPath = `${path}/${uniqueFilename}`;

    try {
      // Save the original file
      await fs.promises.rename(file.path, destinationPath);

      // Compress and resize the image
      const compressedImagePath = `${path}/compressed-${uniqueFilename}`;

      const image = sharp(destinationPath).resize({ width: 800 });

      if (file.mimetype === 'image/png') {
        await image
          .png({ quality: 80, adaptiveFiltering: true })
          .toFile(compressedImagePath);
      } else {
        await image.jpeg({ quality: 80 }).toFile(compressedImagePath);
      }

      // Delete the original file
      await fs.promises.unlink(destinationPath);

      return `compressed-${uniqueFilename}`;
    } catch (error) {
      const errorMessage = await this.i18n.t(
        'errors.uploads.processing_error',
        {
          lang,
        },
      );
      await this.logger.error('Sharp processing error:', error);
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async findFile(path: string): Promise<any> {
    const lang = I18nContext.current().lang;

    try {
      const file = await fs.promises.readFile(path);

      return file;
    } catch (error) {
      const errorMessage = await this.i18n.t('errors.uploads.file_not_found', {
        lang,
      });
      this.logger.error(errorMessage, error.stack);
    }
  }

  async removeFile(path: string): Promise<void> {
    const lang = I18nContext.current().lang;

    try {
      await fs.promises.unlink(path);
    } catch (error) {
      const errorMessage = await this.i18n.t(
        'errors.uploads.removed_file_error',
        {
          lang,
        },
      );
      throw new HttpException(errorMessage, HttpStatus.NOT_FOUND);
    }
  }
}
