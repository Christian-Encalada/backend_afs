import {
  Controller,
  Post,
  Patch,
  Body,
  Param,
  Get,
  Query,
  Logger,
  HttpStatus,
  HttpException,
  Headers,
} from '@nestjs/common';
import { TemplateService } from './template.service';
import { CreateTemplateDto } from './dto/createTemplate.dto';
import { UpdateTemplateDto } from './dto/updateTemplate.dto';
import { GetTemplateDto } from './dto/getTemplate.dto';
import { I18n, I18nContext } from 'nestjs-i18n';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTemplateInitDto } from './dto/createTemplate.init.dto';

@Controller('templates')
@ApiTags('templates')
export class TemplateController {
  private readonly logger = new Logger(TemplateController.name);

  constructor(private readonly templateService: TemplateService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new template' })
  @ApiResponse({
    status: 201,
    description: 'The template has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async createTemplate(
    @Body() createTemplateDto: CreateTemplateDto,
    @Headers('x-tenant-id') tenantId: string,
    @I18n() i18n: I18nContext,
  ): Promise<GetTemplateDto> {
    const lang = i18n.lang;

    if (!tenantId) {
      throw new HttpException(
        'Tenant ID is required in the header',
        HttpStatus.BAD_REQUEST,
      );
    }

    this.logger.log(
      await i18n.t('messages.template.creating_template', { lang }),
    );

    try {
      const template = await this.templateService.createTemplate(
        createTemplateDto,
        tenantId,
      );
      this.logger.log(
        await i18n.t('messages.template.template_created', { lang }),
      );
      return template;
    } catch (error) {
      this.logger.error(
        await i18n.t('errors.template.template_creation_error', { lang }),
        error.stack,
      );
      throw error;
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a template' })
  @ApiResponse({
    status: 200,
    description: 'The template has been successfully updated.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async updateTemplate(
    @Param('id') id: number,
    @Body() updateTemplateDto: UpdateTemplateDto,
    @I18n() i18n: I18nContext,
  ): Promise<GetTemplateDto> {
    const lang = i18n.lang;
    this.logger.log(
      await i18n.t('messages.template.updating_template', {
        args: { id },
        lang,
      }),
    );

    try {
      const template = await this.templateService.updateTemplate(
        id,
        updateTemplateDto,
      );
      this.logger.log(
        await i18n.t('messages.template.template_updated', {
          args: { id },
          lang,
        }),
      );
      return template;
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
  @ApiOperation({ summary: 'Change template status' })
  @ApiResponse({
    status: 200,
    description: 'The template status has been successfully changed.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async changeTemplateStatus(
    @Param('id') id: number,
    @Body('status') status: string,
    @I18n() i18n: I18nContext,
  ): Promise<GetTemplateDto> {
    const lang = i18n.lang;
    this.logger.log(
      await i18n.t('messages.template.changing_status', { args: { id }, lang }),
    );

    try {
      const statusBoolean = status === 'true';
      const template = await this.templateService.changeTemplateStatus(
        id,
        statusBoolean,
      );
      this.logger.log(
        await i18n.t('messages.template.status_changed', {
          args: { id },
          lang,
        }),
      );
      return template;
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
  @ApiOperation({ summary: 'Get paginated list of templates' })
  @ApiResponse({
    status: 200,
    description: 'Return paginated templates.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async getTemplates(
    @I18n() i18n: I18nContext,
    @Headers('x-tenant-id') tenantId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 25,
    @Query('name') name?: string,
    @Query('status') status?: boolean,
    @Query('createdAt') createdAt?: string,
  ): Promise<{ TemplatesPaginated: any; total: number }> {
    const lang = i18n.lang;

    if (!tenantId) {
      const errorMessage = await i18n.t('errors.template.tenant_id_required', {
        lang,
      });
      throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
    }

    this.logger.log(
      await i18n.t('messages.template.fetching_templates_for_tenant', {
        args: { tenantId },
        lang,
      }),
    );

    try {
      return await this.templateService.getTemplatesPaginated(
        tenantId,
        page,
        limit,
        name,
        status,
        createdAt,
      );
    } catch (error) {
      const errorMessage = await i18n.t(
        'errors.template.fetching_templates_error',
        {
          lang,
        },
      );
      this.logger.error(`${errorMessage}: ${error.message}`, error.stack);
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('create_init')
  @ApiOperation({
    summary: 'Create templates from template defaults for a tenant',
  })
  @ApiResponse({
    status: 201,
    description: 'Templates initialized successfully.',
  })
  @ApiResponse({ status: 404, description: 'No active templates found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async createInit(
    @Body() createTemplateInitDto: CreateTemplateInitDto,
    @I18n() i18n: I18nContext,
  ): Promise<void> {
    const lang = i18n.lang;
    this.logger.log(
      await i18n.t('messages.template.initializing_templates', {
        args: { tenantId: createTemplateInitDto.tenantId },
        lang,
      }),
    );
    try {
      await this.templateService.createInit(createTemplateInitDto, lang);
    } catch (error) {
      this.logger.error(
        await i18n.t('errors.template.template_init_error', { lang }),
        error.stack,
      );
      throw error;
    }
  }
}
