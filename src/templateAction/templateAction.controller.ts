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
import { TemplateActionService } from './templateAction.service';
import { CreateTemplateActionDto } from './dto/createTemplateAction.dto';
import { UpdateTemplateActionDto } from './dto/updateTemplateAction.dto';
import { GetTemplateActionDto } from './dto/getTemplateAction.dto';
import { I18n, I18nContext } from 'nestjs-i18n';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('templates/action')
@ApiTags('templatesAction')
export class TemplateActionController {
  private readonly logger = new Logger(TemplateActionController.name);

  constructor(private readonly templateActionService: TemplateActionService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new template action' })
  @ApiResponse({
    status: 201,
    description: 'The template action has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async createTemplateAction(
    @Body() createTemplateActionDto: CreateTemplateActionDto,
    @I18n() i18n: I18nContext,
  ): Promise<GetTemplateActionDto> {
    const lang = i18n.lang;
    this.logger.log(
      await i18n.t('messages.template.creating_template', { lang }),
    );
    try {
      const templateAction =
        await this.templateActionService.createTemplateAction(
          createTemplateActionDto,
        );
      this.logger.log(
        await i18n.t('messages.template.template_created', { lang }),
      );
      return templateAction;
    } catch (error) {
      this.logger.error(
        await i18n.t('errors.template.template_creation_error', { lang }),
        error.stack,
      );
      throw error;
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a template action' })
  @ApiResponse({
    status: 200,
    description: 'The template action has been successfully updated.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async updateTemplateAction(
    @Param('id') id: number,
    @Body() updateTemplateActionDto: UpdateTemplateActionDto,
    @I18n() i18n: I18nContext,
  ): Promise<GetTemplateActionDto> {
    const lang = i18n.lang;
    this.logger.log(
      await i18n.t('messages.template.updating_template', {
        args: { id },
        lang,
      }),
    );
    try {
      const templateAction =
        await this.templateActionService.updateTemplateAction(
          id,
          updateTemplateActionDto,
        );
      this.logger.log(
        await i18n.t('messages.template.template_updated', {
          args: { id },
          lang,
        }),
      );
      return templateAction;
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
  @ApiOperation({ summary: 'Change template action status' })
  @ApiResponse({
    status: 200,
    description: 'The template action status has been successfully changed.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async changeTemplateActionStatus(
    @Param('id') id: number,
    @Body('status') status: string,
    @I18n() i18n: I18nContext,
  ): Promise<GetTemplateActionDto> {
    const lang = i18n.lang;
    this.logger.log(
      await i18n.t('messages.template.changing_status', { args: { id }, lang }),
    );
    try {
      const templateAction =
        await this.templateActionService.changeTemplateActionStatus(
          id,
          status === 'true',
        );
      this.logger.log(
        await i18n.t('messages.template.status_changed', {
          args: { id },
          lang,
        }),
      );
      return templateAction;
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
  @ApiOperation({ summary: 'Get paginated list of template actions' })
  @ApiResponse({
    status: 200,
    description: 'Return paginated template actions.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async getTemplateActions(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 25,
    @Query('name') name?: string,
    @Query('status') status?: boolean,
    @Query('createdAt') createdAt?: string,
  ): Promise<{ TemplateActionsPaginated: any; total: number }> {
    return this.templateActionService.getTemplateActionsPaginated(
      page,
      limit,
      name,
      status,
      createdAt,
    );
  }
}
