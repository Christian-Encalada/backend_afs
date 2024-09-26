import {
  Controller,
  Post,
  Patch,
  Body,
  Param,
  Get,
  Logger,
  Query,
} from '@nestjs/common';
import { TemplateEnvService } from './templateEnv.service';
import { CreateTemplateEnvDto } from './dto/createTemplateEnv.dto';
import { UpdateTemplateEnvDto } from './dto/updateTemplateEnv.dto';
import { GetTemplateEnvDto } from './dto/getTemplateEnv.dto';
import { I18n, I18nContext } from 'nestjs-i18n';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('templates/env')
@ApiTags('templatesEnv')
export class TemplateEnvController {
  private readonly logger = new Logger(TemplateEnvController.name);

  constructor(private readonly templateEnvService: TemplateEnvService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new template environment variable' })
  @ApiResponse({
    status: 201,
    description: 'The environment variable has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async createTemplateEnv(
    @Body() createTemplateEnvDto: CreateTemplateEnvDto,
    @I18n() i18n: I18nContext,
  ): Promise<GetTemplateEnvDto> {
    const lang = i18n.lang;
    this.logger.log(
      await i18n.t('messages.template.creating_template_env', { lang }),
    );
    try {
      const templateEnv =
        await this.templateEnvService.createTemplateEnv(createTemplateEnvDto);
      this.logger.log(
        await i18n.t('messages.template.template_env_created', { lang }),
      );
      return templateEnv;
    } catch (error) {
      this.logger.error(
        await i18n.t('errors.template.template_env_creation_error', { lang }),
        error.stack,
      );
      throw error;
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a template env' })
  @ApiResponse({
    status: 200,
    description: 'The template env has been successfully updated.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async updateTemplateEnv(
    @Param('id') id: number,
    @Body() updateTemplateEnvDto: UpdateTemplateEnvDto,
    @I18n() i18n: I18nContext,
  ): Promise<GetTemplateEnvDto> {
    const lang = i18n.lang;
    this.logger.log(
      await i18n.t('messages.template.updating_template', {
        args: { id },
        lang,
      }),
    );
    try {
      const templateEnv = await this.templateEnvService.updateTemplateEnv(
        id,
        updateTemplateEnvDto,
      );
      this.logger.log(
        await i18n.t('messages.template.template_updated', {
          args: { id },
          lang,
        }),
      );
      return templateEnv;
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
  @ApiOperation({ summary: 'Change template env status' })
  @ApiResponse({
    status: 200,
    description: 'The template env status has been successfully changed.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async changeTemplateEnvStatus(
    @Param('id') id: number,
    @Body('status') status: string,
    @I18n() i18n: I18nContext,
  ): Promise<GetTemplateEnvDto> {
    const lang = i18n.lang;
    this.logger.log(
      await i18n.t('messages.template.changing_status', { args: { id }, lang }),
    );
    try {
      const templateEnv = await this.templateEnvService.changeTemplateEnvStatus(
        id,
        status === 'true',
      );
      this.logger.log(
        await i18n.t('messages.template.status_changed', {
          args: { id },
          lang,
        }),
      );
      return templateEnv;
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
  @ApiOperation({ summary: 'Get paginated list of template envs' })
  @ApiResponse({
    status: 200,
    description: 'Return paginated template envs.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async getTemplateEnvs(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 25,
    @Query('name') name?: string,
    @Query('status') status?: boolean,
    @Query('createdAt') createdAt?: string,
  ): Promise<{ TemplateEnvsPaginated: any; total: number }> {
    return this.templateEnvService.getTemplateEnvsPaginated(
      page,
      limit,
      name,
      status,
      createdAt,
    );
  }
}
