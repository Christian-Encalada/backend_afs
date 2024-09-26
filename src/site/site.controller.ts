import {
  Controller,
  Post,
  Body,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Query,
  Patch,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { I18n, I18nContext } from 'nestjs-i18n';
import { SiteService } from './site.service';
import { SiteGetDto } from './dto/siteGet.dto';
import { Site } from './site.entity';
import { SiteDto } from './dto/site.dto';
import { SiteUpdateDto } from './dto/siteUpdate.dto';
import { SiteGetFilterDto } from './dto/siteGetFilter.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, Multer } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';

@Controller('sites')
@ApiTags('sites')
export class SiteController {
  private readonly logger = new Logger(SiteController.name);

  constructor(private readonly siteService: SiteService) {}

  // Request to get all sites with filters optionals
  @Get()
  @ApiOperation({ summary: 'Get all sites with optionals filters' })
  @ApiResponse({
    status: 200,
    description: 'Returns all sites or filtered stites.',
    type: [SiteGetDto],
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async findAllFiltered(
    @I18n() i18n: I18nContext,
    @Query() siteFilterDto: SiteGetFilterDto,
  ): Promise<SiteGetDto[]> {
    const lang = i18n.lang;
    this.logger.log(await i18n.t('messages.site.fetching_all_sites', { lang }));

    try {
      return await this.siteService.findAllFilter(siteFilterDto);
    } catch (error) {
      this.logger.error(
        await i18n.t('errors.site.error_fetching_sites', { lang }),
        error.stack,
      );

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        await i18n.t('errors.site.error_fetching_sites', { lang }),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Find by ID
  @Get('/:id')
  @ApiOperation({ summary: 'Find a Site by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns a site finded by ID.',
    type: [SiteGetDto],
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async findOneById(
    @I18n() i18n: I18nContext,
    @Param('id') id: number,
  ): Promise<SiteGetDto> {
    const lang = i18n.lang;
    this.logger.log(await i18n.t('messages.site.fetching_all_sites', { lang }));

    try {
      return await this.siteService.findOneById(id);
    } catch (error) {
      this.logger.error(
        await i18n.t('errors.site.error_fetching_sites', { lang }),
        error.stack,
      );

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        await i18n.t('errors.site.error_fetching_sites', { lang }),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Request to create a Site
  @Post()
  @ApiOperation({ summary: 'Create a Site' })
  @ApiResponse({
    status: 201,
    description: 'The site has been successfully created.',
    type: Site,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @UseInterceptors(
    FileInterceptor('logo', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = 'src/upload/uploads';
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = `${uuidv4()}-${Date.now()}`;
          const extension = file.mimetype.split('/')[1];
          const filename = `${uniqueSuffix}.${extension}`;
          cb(null, filename);
        },
      }),
      limits: { fileSize: 2 * 1024 * 1024 }, // 2MB límite de tamaño de archivo
    }),
  )
  async createSite(
    @Body() createSiteDto: SiteDto,
    @UploadedFile() logo: Multer.File,
    @I18n() i18n: I18nContext,
  ): Promise<Site> {
    const lang = i18n.lang;

    this.logger.log(await i18n.t('messages.site.creating_site', { lang }));

    try {
      createSiteDto.logo = logo;
      const site = await this.siteService.createSite(createSiteDto);

      this.logger.log(await i18n.t('messages.site.site_created', { lang }));

      return site;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        await i18n.t('errors.site.site_creation_error', { lang }),
        error.stack,
      );

      throw new HttpException(
        await i18n.t('errors.site.site_creation_error', { lang }),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Request to update a Site
  @Patch('/:id')
  @ApiOperation({ summary: 'Update a site' })
  @ApiResponse({
    status: 200,
    description: 'The Site has been successfully updated.',
    type: Site,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  @UseInterceptors(
    FileInterceptor('logo', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = 'src/upload/uploads';
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = `${uuidv4()}-${Date.now()}`;
          const extension = file.mimetype.split('/')[1];
          const filename = `${uniqueSuffix}.${extension}`;
          cb(null, filename);
        },
      }),
      limits: { fileSize: 2 * 1024 * 1024 }, // 2MB límite de tamaño de archivo
    }),
  )
  async updateSite(
    @Param('id') id: number,
    @Body() siteUpdateDto: SiteUpdateDto,
    @UploadedFile() logo: Multer.File,
    @I18n() i18n: I18nContext,
  ): Promise<SiteGetDto> {
    const lang = i18n.lang;

    this.logger.log(
      await i18n.t('messages.site.updating_site', { args: { id }, lang }),
    );

    try {
      siteUpdateDto.logo = logo;
      const updatedSite = await this.siteService.updateSite(id, siteUpdateDto);
      this.logger.log(
        await i18n.t('messages.site.site_updated', {
          args: { id },
          lang,
        }),
      );
      return updatedSite;
    } catch (error) {
      // See a HttpException throwed in services
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        await i18n.t('errors.site.site_update_error', {
          args: { id },
          lang,
        }),
        error.stack,
      );
      throw new HttpException(
        await i18n.t('errors.site.site_update_error', { lang }),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Request to update the state of a Site
  @Patch('status/:id')
  @ApiOperation({ summary: 'Update the state of a site' })
  @ApiResponse({
    status: 200,
    description: 'The Site has been successfully updated.',
    type: Site,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  async changeStateSite(
    @Param('id') id: number,
    @Body() siteUpdateDto: SiteUpdateDto,
    @I18n() i18n: I18nContext,
  ): Promise<SiteGetDto> {
    console.log(`Body: ${JSON.stringify(siteUpdateDto)}`);
    const lang = i18n.lang;

    this.logger.log(
      await i18n.t('messages.site.updating_state_site', { args: { id }, lang }),
    );

    try {
      const updatedSite = await this.siteService.changeState(id, siteUpdateDto);
      this.logger.log(
        await i18n.t('messages.site.site_updated', {
          args: { id },
          lang,
        }),
      );
      return updatedSite;
    } catch (error) {
      // See a HttpException throwed in services
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        await i18n.t('errors.site.site_update_error', {
          args: { id },
          lang,
        }),
        error.stack,
      );
      throw new HttpException(
        await i18n.t('errors.site.site_update_error', { lang }),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
