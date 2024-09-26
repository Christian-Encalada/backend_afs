import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Template } from './template.entity';
import { CreateTemplateDto } from './dto/createTemplate.dto';
import { UpdateTemplateDto } from './dto/updateTemplate.dto';
import { GetTemplateDto } from './dto/getTemplate.dto';
import { plainToInstance } from 'class-transformer';
import { I18nService, I18nContext } from 'nestjs-i18n';
import { CreateTemplateInitDto } from './dto/createTemplate.init.dto';
import { Tenant } from '@/tenant/tenant.entity';
import { TemplateAction } from '@/templateAction/templateAction.entity';
import { TemplateEnv } from '@/templateEnv/templateEnv.entity';
import { TemplateDefault } from '@/templateDefault/templateDefault.entity';

@Injectable()
export class TemplateService {
  private readonly logger = new Logger(TemplateService.name);

  constructor(
    @InjectRepository(Template)
    private templateRepository: Repository<Template>,
    @InjectRepository(TemplateAction)
    private templateActionRepository: Repository<TemplateAction>,
    @InjectRepository(TemplateEnv)
    private templateEnvRepository: Repository<TemplateEnv>,
    @InjectRepository(TemplateDefault)
    private templateDefaultRepository: Repository<TemplateDefault>,
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
    private readonly i18n: I18nService,
  ) {}

  private async findEntityOrThrow<T>(
    repository: Repository<T>,
    id: number | undefined,
    name: string,
  ): Promise<T> {
    const entity = await repository.findOne({ where: { id } as any });
    if (!entity) {
      throw new HttpException(`${name} not found`, HttpStatus.NOT_FOUND);
    }
    return entity;
  }

  async createTemplate(
    createTemplateDto: CreateTemplateDto,
    tenantName: string,
  ): Promise<GetTemplateDto> {
    const { name, content, action, templateEnvIds, status, activate } =
      createTemplateDto;

    try {
      const tenant = await this.tenantRepository.findOne({
        where: { name: tenantName },
      });
      if (!tenant) {
        throw new HttpException('Tenant not found', HttpStatus.NOT_FOUND);
      }

      const actionEntity = await this.findEntityOrThrow(
        this.templateActionRepository,
        action,
        'action',
      );

      const templateEnvEntities =
        await this.templateEnvRepository.findByIds(templateEnvIds);

      if (templateEnvEntities.length !== templateEnvIds.length) {
        throw new HttpException(
          'Some template variables not found',
          HttpStatus.NOT_FOUND,
        );
      }

      const contentMatches = content.match(/\[([^\]]+)\]/g);
      if (contentMatches) {
        const variablesInContent = contentMatches.map((variable) =>
          variable.replace(/[\[\]]/g, ''),
        );
        const variablesFromEnv = templateEnvEntities.map((env) =>
          env.env.replace(/[\[\]]/g, ''),
        );

        // Imprimimos variables para debug
        console.log('Variables en content:', variablesInContent);
        console.log('Variables en templateEnv:', variablesFromEnv);

        const allVariablesExist = variablesInContent.every((varInContent) =>
          variablesFromEnv.includes(varInContent),
        );

        if (!allVariablesExist) {
          throw new HttpException(
            `Some content variables do not match templateEnv variables: ${variablesInContent.join(', ')}`,
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      const newTemplate = this.templateRepository.create({
        name,
        content,
        status,
        activate,
        tenant,
        action: actionEntity,
        templateEnvs: templateEnvEntities,
      });

      await this.templateRepository.save(newTemplate);

      const savedTemplate = await this.templateRepository.findOne({
        where: { id: newTemplate.id },
        relations: ['action', 'templateEnvs'],
      });

      return plainToInstance(GetTemplateDto, savedTemplate, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      const errorMessage = await this.i18n.translate(
        'errors.template.template_creation_error',
        {
          lang: I18nContext.current().lang,
        },
      );
      this.logger.error(errorMessage, error.stack);
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateTemplate(
    id: number,
    updateTemplateDto: UpdateTemplateDto,
  ): Promise<GetTemplateDto> {
    const template = await this.templateRepository.findOne({
      where: { id },
      relations: ['tenant', 'action', 'templateEnvs'],
    });

    if (!template) {
      const errorMsg = await this.i18n.translate(
        'errors.template.template_not_found',
        {
          args: { id },
          lang: I18nContext.current().lang,
        },
      );
      this.logger.error(errorMsg);
      throw new HttpException(errorMsg, HttpStatus.NOT_FOUND);
    }

    if (Object.keys(updateTemplateDto).length === 0) {
      const errorMsg = await this.i18n.translate(
        'errors.template.template_not_update_data',
        {
          lang: I18nContext.current().lang,
        },
      );
      this.logger.error(errorMsg);
      throw new HttpException(errorMsg, HttpStatus.BAD_REQUEST);
    }

    Object.assign(template, updateTemplateDto);

    if (updateTemplateDto.action !== undefined) {
      template.action = await this.findEntityOrThrow(
        this.templateActionRepository,
        updateTemplateDto.action,
        'action',
      );
    }

    if (updateTemplateDto.templateEnvIds !== undefined) {
      const templateEnvEntities = await this.templateEnvRepository.findByIds(
        updateTemplateDto.templateEnvIds,
      );
      if (
        templateEnvEntities.length !== updateTemplateDto.templateEnvIds.length
      ) {
        throw new HttpException(
          'Some template variables not found',
          HttpStatus.NOT_FOUND,
        );
      }
      template.templateEnvs = templateEnvEntities;
    }

    const updatedTemplate = await this.templateRepository.save(template);

    const getTemplateDto = plainToInstance(GetTemplateDto, updatedTemplate, {
      excludeExtraneousValues: true,
    });

    const successMsg = await this.i18n.translate(
      'messages.template.template_updated',
      {
        args: { id: updatedTemplate.id },
        lang: I18nContext.current().lang,
      },
    );
    this.logger.log(successMsg);

    return getTemplateDto;
  }

  async changeTemplateStatus(
    id: number,
    status: boolean,
  ): Promise<GetTemplateDto> {
    try {
      const template = await this.templateRepository.findOne({ where: { id } });

      if (!template) {
        const notFoundMessage = await this.i18n.translate(
          'errors.template.template_not_found',
          { lang: I18nContext.current().lang },
        );
        throw new HttpException(notFoundMessage, HttpStatus.NOT_FOUND);
      }

      template.status = status;

      const updatedTemplate = await this.templateRepository.save(template);

      const getTemplateDto = plainToInstance(GetTemplateDto, updatedTemplate, {
        excludeExtraneousValues: true,
      });

      const successMessage = await this.i18n.translate(
        'messages.template.status_changed',
        { args: { id: updatedTemplate.id }, lang: I18nContext.current().lang },
      );
      this.logger.log(successMessage);

      return getTemplateDto;
    } catch (error) {
      const errorMessage = await this.i18n.translate(
        'errors.template.status_change_error',
        { lang: I18nContext.current().lang },
      );
      this.logger.error(errorMessage, error.stack);
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getTemplatesPaginated(
    tenantName: string,
    page: number,
    limit: number,
    name?: string,
    status?: boolean,
    createdAt?: string,
  ): Promise<{ TemplatesPaginated: any; total: number }> {
    if (page < 1 || limit < 1) {
      const errorMessage = await this.i18n.translate(
        'errors.template.template_invalid_pagination_params',
        {
          lang: I18nContext.current().lang,
        },
      );
      throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
    }

    try {
      const hasFilters = name || status !== undefined || createdAt;

      let fetchingMessage: string;
      if (hasFilters) {
        fetchingMessage = await this.i18n.translate(
          'messages.template.fetching_filtered_templates',
          {
            lang: I18nContext.current().lang,
          },
        );
      } else {
        fetchingMessage = await this.i18n.translate(
          'messages.template.fetching_all_templates',
          {
            lang: I18nContext.current().lang,
          },
        );
      }
      this.logger.log(fetchingMessage);

      const queryBuilder =
        this.templateRepository.createQueryBuilder('template');

      queryBuilder
        .leftJoinAndSelect('template.tenant', 'tenant')
        .leftJoinAndSelect('template.action', 'action')
        .leftJoinAndSelect('template.templateEnvs', 'templateEnvs')
        .where('tenant.name = :tenantName', { tenantName });

      if (status !== undefined) {
        queryBuilder.andWhere('template.status = :status', { status });
      }

      if (name) {
        queryBuilder.andWhere('LOWER(template.name) LIKE LOWER(:name)', {
          name: `%${name}%`,
        });
      }

      if (createdAt) {
        queryBuilder.andWhere('DATE(template.createdAt) = :createdAt', {
          createdAt,
        });
      }

      const filteredTotal = await queryBuilder.getCount();

      queryBuilder.skip((page - 1) * limit).take(limit);

      const templates = await queryBuilder.getMany();

      const templateDtos = templates.map((template) =>
        plainToInstance(GetTemplateDto, template, {
          excludeExtraneousValues: true,
        }),
      );

      let fetchedMessage: string;
      if (hasFilters) {
        fetchedMessage = await this.i18n.translate(
          'messages.template.fetched_filtered_templates',
          {
            args: { count: templateDtos.length },
            lang: I18nContext.current().lang,
          },
        );
      } else {
        fetchedMessage = await this.i18n.translate(
          'messages.template.fetched_all_templates',
          {
            lang: I18nContext.current().lang,
          },
        );
      }
      this.logger.log(fetchedMessage);

      const totalPages = Math.ceil(filteredTotal / limit);

      const templatesPaginated: any = {
        data: templateDtos,
        filteredTotal,
        templatesPerPage: templateDtos.length,
        totalPages,
      };

      return {
        TemplatesPaginated: templatesPaginated,
        total: await this.templateRepository.count(),
      };
    } catch (error) {
      const errorMessage = await this.i18n.translate(
        'errors.template.template_failed_to_retrieve_templates',
        {
          lang: I18nContext.current().lang,
        },
      );
      this.logger.error(errorMessage, error.stack);
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createInit(
    createTemplateInitDto: CreateTemplateInitDto,
    lang: string,
  ): Promise<void> {
    const { tenantId } = createTemplateInitDto;

    try {
      const templateDefaults = await this.templateDefaultRepository.find({
        where: { activate: true },
      });

      if (templateDefaults.length === 0) {
        const noActiveTemplatesMessage = await this.i18n.translate(
          'errors.template.no_active_templates',
          { lang },
        );
        this.logger.warn(noActiveTemplatesMessage);
        throw new HttpException(noActiveTemplatesMessage, HttpStatus.NOT_FOUND);
      }

      for (const templateDefault of templateDefaults) {
        const newTemplate = this.templateRepository.create({
          name: templateDefault.name,
          content: templateDefault.content,
          tenant: { id: tenantId },
          status: !!templateDefault.status,
          activate: true,
          action: null,
        });

        await this.templateRepository.save(newTemplate);
      }

      const successMessage = await this.i18n.translate(
        'messages.template.templates_initialized',
        { args: { tenantId }, lang },
      );
      this.logger.log(successMessage);
    } catch (error) {
      const errorMessage = await this.i18n.translate(
        'errors.template.template_init_error',
        { lang },
      );
      this.logger.error(errorMessage, error.stack);
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
