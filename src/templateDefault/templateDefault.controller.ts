import {
  Controller,
  Post,
  Patch,
  Body,
  Param,
  Get,
  Logger,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { TemplateDefaultService } from './templateDefault.service';
import { CreateTemplateDefaultDto } from './dto/createTemplateDefault.dto';
import { UpdateTemplateDefaultDto } from './dto/updateTemplateDefault.dto';
import { GetTemplateDefaultDto } from './dto/getTemplateDefault.dto';
import { I18n, I18nContext } from 'nestjs-i18n';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('templates/default')
@ApiTags('templatesDefault')
export class TemplateDefaultController {
  private readonly logger = new Logger(TemplateDefaultController.name);

  constructor(
    private readonly templateDefaultService: TemplateDefaultService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new template default' })
  @ApiResponse({
    status: 201,
    description: 'The template default has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async createTemplateDefault(
    @Body() createTemplateDefaultDto: CreateTemplateDefaultDto,
    @I18n() i18n: I18nContext,
  ): Promise<GetTemplateDefaultDto> {
    const lang = i18n.lang;
    this.logger.log(
      await i18n.t('messages.template.creating_template', { lang }),
    );
    try {
      const templateDefault =
        await this.templateDefaultService.createTemplateDefault(
          createTemplateDefaultDto,
        );
      this.logger.log(
        await i18n.t('messages.template.template_created', { lang }),
      );
      return templateDefault;
    } catch (error) {
      this.logger.error(
        await i18n.t('errors.template.template_creation_error', { lang }),
        error.stack,
      );
      throw error;
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a template default' })
  @ApiResponse({
    status: 200,
    description: 'The template default has been successfully updated.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async updateTemplateDefault(
    @Param('id') id: number,
    @Body() updateTemplateDefaultDto: UpdateTemplateDefaultDto,
    @I18n() i18n: I18nContext,
  ): Promise<GetTemplateDefaultDto> {
    const lang = i18n.lang;
    this.logger.log(
      await i18n.t('messages.template.updating_template', {
        args: { id },
        lang,
      }),
    );
    try {
      const templateDefault =
        await this.templateDefaultService.updateTemplateDefault(
          id,
          updateTemplateDefaultDto,
        );
      this.logger.log(
        await i18n.t('messages.template.template_updated', {
          args: { id },
          lang,
        }),
      );
      return templateDefault;
    } catch (error) {
      this.logger.error(
        await i18n.t('errors.template.template_update_error', {
          args: { id },
          lang,
        }),
        error.stack,
      );
      throw error;
    }
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Change template default status' })
  @ApiResponse({
    status: 200,
    description: 'The template default status has been successfully changed.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async changeTemplateDefaultStatus(
    @Param('id') id: number,
    @Body('status') status: string,
    @I18n() i18n: I18nContext,
  ): Promise<GetTemplateDefaultDto> {
    const lang = i18n.lang;
    this.logger.log(
      await i18n.t('messages.template.changing_status', { args: { id }, lang }),
    );
    try {
      const templateDefault =
        await this.templateDefaultService.changeTemplateDefaultStatus(
          id,
          status,
        );
      this.logger.log(
        await i18n.t('messages.template.status_changed', {
          args: { id },
          lang,
        }),
      );
      return templateDefault;
    } catch (error) {
      this.logger.error(
        await i18n.t('errors.template.status_change_error', {
          args: { id },
          lang,
        }),
        error.stack,
      );
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all template defaults' })
  @ApiResponse({
    status: 200,
    description: 'The template defaults have been successfully retrieved.',
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async findAllTemplateDefaults(
    @I18n() i18n: I18nContext,
  ): Promise<GetTemplateDefaultDto[]> {
    const lang = i18n.lang;
    this.logger.log(
      await i18n.t('messages.template.fetching_all_templates', { lang }),
    );
    try {
      const templateDefaults =
        await this.templateDefaultService.findAllTemplateDefaults();
      this.logger.log(
        await i18n.t('messages.template.templates_retrieved', { lang }),
      );
      return templateDefaults;
    } catch (error) {
      this.logger.error(
        await i18n.t('errors.internal_server_error', { lang }),
        error.stack,
      );
      throw new HttpException(
        await i18n.t('errors.internal_server_error', { lang }),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
