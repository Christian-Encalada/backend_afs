import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  InternalServerErrorException,
  Logger,
  Param,
  Get,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, Multer } from 'multer';
import { I18n, I18nContext } from 'nestjs-i18n';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';
import { UploadSiteService } from './uploadSite.service';
import * as fs from 'fs/promises';

@ApiTags('Uploads')
@Controller('upload')
export class UploadController {
  private readonly logger = new Logger(UploadController.name);
  constructor(private readonly uploadSiteService: UploadSiteService) {}

  @Post('site/logo/:id')
  @ApiOperation({ summary: 'Upload and compress an image file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Image file to be uploaded',
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Image uploaded and compressed successfully',
    schema: {
      example: {
        message: 'Image uploaded and compressed successfully',
        filename: 'compressed-unique-filename.jpg',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid image file',
    schema: {
      example: {
        statusCode: 400,
        message: 'Invalid image file',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    schema: {
      example: {
        statusCode: 500,
        message: 'An error occurred while processing the image',
        error: 'Internal Server Error',
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: 'src/upload/uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = `${uuidv4()}-${Date.now()}`;
          const extension = file.mimetype.split('/')[1];
          const filename = `${uniqueSuffix}.${extension}`;
          callback(null, filename);
        },
      }),
      limits: { fileSize: 2 * 1024 * 1024 }, // 2MB file size limit
    }),
  )
  async uploadSiteLogo(
    @UploadedFile() file: Multer.File,
    @Param('id') id: number,
    @I18n() i18n: I18nContext,
  ) {
    const lang = i18n.lang;

    if (!file) {
      const errorMessage = await i18n.t('errors.uploads.invalid_image', {
        lang,
      });
      throw new BadRequestException(errorMessage);
    }

    try {
      const filename: string = await this.uploadSiteService.updateSiteLogo(
        id,
        file,
      );
      const successMessage = await i18n.t('messages.uploads.success_uploaded');
      return {
        message: successMessage,
        filename,
      };
    } catch (error) {
      await this.logger.error(
        'An error occurred while processing the image',
        error.stack,
      );

      const errorMessage = await i18n.t('errors.uploads.processing_error');
      throw new InternalServerErrorException(errorMessage);
    }
  }

  @Get('get-logo/:logoName')
  @ApiOperation({ summary: 'Get the logo of site' })
  @ApiResponse({
    status: 200,
    description: 'The link of the Image has been successfully seended.',
    type: String,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  async getLogoSite(
    @Param('logoName') logoName: string,
    @Res() res: Response,
    @I18n() i18n: I18nContext,
  ): Promise<any> {
    const lang = i18n.lang;

    const findingMessage = await i18n.t('messages.uploads.finding_logo', {
      lang,
    });
    await this.logger.log(findingMessage, lang);

    const filePath = await this.uploadSiteService.findLogo(logoName);

    if (!filePath) {
      const errorMessage = await i18n.t('errors.uploads.file_not_found', {
        lang,
      });
      throw new BadRequestException(errorMessage);
    }

    const successMessage = await i18n.t('messages.uploads.logo_found', {
      lang,
    });
    await this.logger.log(successMessage, lang);

    const stat = await fs.stat(filePath);
    const mimeType = logoName.endsWith('.png') ? 'image/png' : 'image/jpeg';

    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `inline; filename="${logoName}"`);
    res.setHeader('Content-Length', stat.size);

    return res.sendFile(filePath);
  }
}
