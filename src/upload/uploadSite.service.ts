import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Multer } from 'multer';
import { UploadService } from './upload.service';
import { Site } from '@/site/site.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { I18nService, I18nContext } from 'nestjs-i18n';
import * as path from 'path';

@Injectable()
export class UploadSiteService {
  private readonly logger = new Logger(UploadSiteService.name);

  private readonly imageFolder = path.join(
    __dirname,
    '..',
    '..',
    'src',
    'upload',
    'uploads',
    'site',
    'logo',
  );

  constructor(
    @InjectRepository(Site)
    private readonly siteRepository: Repository<Site>,
    private readonly uploadService: UploadService,
    // Languaje Service
    private readonly i18n: I18nService,
  ) {}

  async saveSiteLogo(file: Multer.File): Promise<string> {
    const lang = I18nContext.current().lang;

    // File type validation
    const allowedMimeTypes = ['image/png', 'image/jpeg'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      const errorMessage = await this.i18n.t(
        'errors.uploads.invalid_file_type',
        {
          lang,
        },
      );
      throw new BadRequestException(errorMessage);
    }

    try {
      await this.logger.log('messages.site.logo_uploading', {
        lang,
      });

      const filename: string = await this.uploadService.saveFile(
        this.imageFolder,
        file,
      );

      await this.logger.log('messages.uploads.file_success_uploaded', {
        args: { filename },
        lang,
      });

      await this.logger.log('messages.site.logo_uploaded', {
        lang,
      });

      return filename;
    } catch (error) {
      const errorMessage = await this.i18n.t(
        'errors.uploads.processing_error',
        {
          lang,
        },
      );
      console.error('Sharp processing error:', error);
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async updateSiteLogo(id: number, file: Multer.File): Promise<string> {
    const lang = I18nContext.current().lang;

    // File type validation
    const allowedMimeTypes = ['image/png', 'image/jpeg'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      const errorMessage = await this.i18n.t(
        'errors.uploads.invalid_file_type',
        {
          lang,
        },
      );
      throw new BadRequestException(errorMessage);
    }

    // Find the site
    const site: Site = await this.siteRepository.findOne({
      where: { id },
      relations: ['tenant'],
    });

    if (!site) {
      const errorMessage = await this.i18n.t('errors.site.site_not_found', {
        lang,
      });
      this.logger.error(`${errorMessage}: ID ${id}`);
      throw new HttpException(errorMessage, HttpStatus.NOT_FOUND);
    }

    try {
      await this.findAndDeleteLogo(site.logo);

      await this.logger.log('messages.site.logo_uploading', {
        lang,
      });

      const filename = await this.uploadService.saveFile(
        this.imageFolder,
        file,
      );

      await this.logger.log('messages.uploads.file_success_uploaded', {
        args: { filename },
        lang,
      });

      await this.logger.log('messages.site.logo_uploaded', {
        lang,
      });

      return filename;
    } catch (error) {
      const errorMessage = await this.i18n.t(
        'errors.uploads.processing_error',
        {
          lang,
        },
      );
      console.error('Sharp processing error:', error);
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async findAndDeleteLogo(filename: string): Promise<any> {
    const logoFile = await this.uploadService.findFile(
      `${this.imageFolder}/${filename}`,
    );

    if (logoFile) {
      await this.uploadService.removeFile(`${this.imageFolder}/${filename}`);
    }
  }

  async findLogo(filename: string): Promise<string> {
    const lang = I18nContext.current().lang;

    const filePath = path.join(this.imageFolder, filename);

    const logoFile = this.uploadService.findFile(filePath);

    if (!logoFile) {
      const errorMessage = await this.i18n.t('errors.uploads.file_not_found', {
        lang,
      });
      this.logger.error(errorMessage);

      throw new HttpException(errorMessage, HttpStatus.NOT_FOUND);
    }

    return filePath;
  }
}
