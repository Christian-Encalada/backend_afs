import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TemplateAction } from './templateAction.entity';
import { CreateTemplateActionDto } from './dto/createTemplateAction.dto';
import { UpdateTemplateActionDto } from './dto/updateTemplateAction.dto';
import { GetTemplateActionDto } from './dto/getTemplateAction.dto';
import { plainToInstance } from 'class-transformer';
import { I18nService, I18nContext } from 'nestjs-i18n';

@Injectable()
export class TemplateActionService {
  private readonly logger = new Logger(TemplateActionService.name);

  constructor(
    @InjectRepository(TemplateAction)
    private templateActionRepository: Repository<TemplateAction>,
    private readonly i18n: I18nService,
  ) {}

  async createTemplateAction(
    createTemplateActionDto: CreateTemplateActionDto,
  ): Promise<GetTemplateActionDto> {
    try {
      const templateAction = this.templateActionRepository.create({
        ...createTemplateActionDto,
        status: !!createTemplateActionDto.status,
      });
      const savedTemplateAction =
        await this.templateActionRepository.save(templateAction);
      const successMessage = await this.i18n.translate(
        'messages.template.template_action_created',
        {
          args: { id: savedTemplateAction.id },
          lang: I18nContext.current().lang,
        },
      );
      this.logger.log(successMessage);
      return plainToInstance(GetTemplateActionDto, savedTemplateAction, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      const errorMessage = await this.i18n.translate(
        'errors.template.template_action_creation_error',
        {
          lang: I18nContext.current().lang,
        },
      );
      this.logger.error(errorMessage, error.stack);
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateTemplateAction(
    id: number,
    updateTemplateActionDto: UpdateTemplateActionDto,
  ): Promise<GetTemplateActionDto> {
    try {
      await this.templateActionRepository.update(id, {
        ...updateTemplateActionDto,
        status: !!updateTemplateActionDto.status,
      });
      const updatedTemplateAction = await this.templateActionRepository.findOne(
        { where: { id } },
      );
      if (!updatedTemplateAction) {
        const notFoundMessage = await this.i18n.translate(
          'errors.template.template_action_not_found',
          {
            lang: I18nContext.current().lang,
          },
        );
        throw new HttpException(notFoundMessage, HttpStatus.NOT_FOUND);
      }
      const successMessage = await this.i18n.translate(
        'messages.template.template_action_updated',
        {
          args: { id: updatedTemplateAction.id },
          lang: I18nContext.current().lang,
        },
      );
      this.logger.log(successMessage);
      return plainToInstance(GetTemplateActionDto, updatedTemplateAction, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      const errorMessage = await this.i18n.translate(
        'errors.template.template_action_update_error',
        {
          lang: I18nContext.current().lang,
        },
      );
      this.logger.error(errorMessage, error.stack);
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async changeTemplateActionStatus(
    id: number,
    status: boolean,
  ): Promise<GetTemplateActionDto> {
    try {
      await this.templateActionRepository.update(id, { status });
      const updatedTemplateAction = await this.templateActionRepository.findOne(
        { where: { id } },
      );
      if (!updatedTemplateAction) {
        const notFoundMessage = await this.i18n.translate(
          'errors.template.template_action_not_found',
          {
            lang: I18nContext.current().lang,
          },
        );
        throw new HttpException(notFoundMessage, HttpStatus.NOT_FOUND);
      }
      const successMessage = await this.i18n.translate(
        'messages.template.status_changed',
        {
          args: { id: updatedTemplateAction.id },
          lang: I18nContext.current().lang,
        },
      );
      this.logger.log(successMessage);
      return plainToInstance(GetTemplateActionDto, updatedTemplateAction, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      const errorMessage = await this.i18n.translate(
        'errors.template.status_change_error',
        {
          lang: I18nContext.current().lang,
        },
      );
      this.logger.error(errorMessage, error.stack);
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getTemplateActionsPaginated(
    page: number,
    limit: number,
    name?: string,
    status?: boolean,
    createdAt?: string,
  ): Promise<{ TemplateActionsPaginated: any; total: number }> {
    if (page < 1 || limit < 1) {
      const errorMessage = await this.i18n.translate(
        'errors.template.template_action_invalid_pagination_params',
        { lang: I18nContext.current().lang },
      );
      throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
    }

    try {
      const fetchingMessage = await this.i18n.translate(
        'messages.template.fetching_all_template_actions',
        { lang: I18nContext.current().lang },
      );
      this.logger.log(fetchingMessage);

      const queryBuilder =
        this.templateActionRepository.createQueryBuilder('templateAction');

      if (status !== undefined) {
        queryBuilder.andWhere('templateAction.status = :status', { status });
      }

      if (name) {
        queryBuilder.andWhere('LOWER(templateAction.name) LIKE LOWER(:name)', {
          name: `%${name}%`,
        });
      }

      if (createdAt) {
        queryBuilder.andWhere('DATE(templateAction.createdAt) = :createdAt', {
          createdAt,
        });
      }

      const filteredTotal = await queryBuilder.getCount();

      queryBuilder.skip((page - 1) * limit).take(limit);

      const templateActions = await queryBuilder.getMany();

      const templateActionDtos = templateActions.map((templateAction) =>
        plainToInstance(GetTemplateActionDto, templateAction, {
          excludeExtraneousValues: true,
        }),
      );

      const fetchedMessage = await this.i18n.translate(
        'messages.template.fetched_template_actions',
        {
          args: { count: templateActionDtos.length },
          lang: I18nContext.current().lang,
        },
      );
      this.logger.log(fetchedMessage);

      const totalPages = Math.ceil(filteredTotal / limit);

      const templateActionsPaginated = {
        data: templateActionDtos,
        filteredTotal,
        templateActionsPerPage: templateActionDtos.length,
        totalPages,
      };

      return {
        TemplateActionsPaginated: templateActionsPaginated,
        total: await this.templateActionRepository.count(),
      };
    } catch (error) {
      const errorMessage = await this.i18n.translate(
        'errors.template.template_action_failed_to_retrieve_template_actions',
        { lang: I18nContext.current().lang },
      );
      this.logger.error(errorMessage, error.stack);
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
