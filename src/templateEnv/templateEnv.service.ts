import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TemplateEnv } from './templateEnv.entity';
import { CreateTemplateEnvDto } from './dto/createTemplateEnv.dto';
import { UpdateTemplateEnvDto } from './dto/updateTemplateEnv.dto';
import { GetTemplateEnvDto } from './dto/getTemplateEnv.dto';
import { plainToInstance } from 'class-transformer';
import { I18nService, I18nContext } from 'nestjs-i18n';

@Injectable()
export class TemplateEnvService {
  private readonly logger = new Logger(TemplateEnvService.name);

  constructor(
    @InjectRepository(TemplateEnv)
    private templateEnvRepository: Repository<TemplateEnv>,
    private readonly i18n: I18nService,
  ) {}

  async createTemplateEnv(
    createTemplateEnvDto: CreateTemplateEnvDto,
  ): Promise<GetTemplateEnvDto> {
    try {
      const templateEnv =
        this.templateEnvRepository.create(createTemplateEnvDto);

      const savedTemplateEnv =
        await this.templateEnvRepository.save(templateEnv);

      const successMessage = await this.i18n.translate(
        'messages.template.template_env_created',
        {
          args: { id: savedTemplateEnv.id },
          lang: I18nContext.current().lang,
        },
      );
      this.logger.log(successMessage);

      return plainToInstance(GetTemplateEnvDto, savedTemplateEnv, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      const errorMessage = await this.i18n.translate(
        'errors.template.template_env_creation_error',
        {
          lang: I18nContext.current().lang,
        },
      );
      this.logger.error(errorMessage, error.stack);
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateTemplateEnv(
    id: number,
    updateTemplateEnvDto: UpdateTemplateEnvDto,
  ): Promise<GetTemplateEnvDto> {
    try {
      await this.templateEnvRepository.update(id, {
        ...updateTemplateEnvDto,
        status: !!updateTemplateEnvDto.status,
      });
      const updatedTemplateEnv = await this.templateEnvRepository.findOne({
        where: { id },
      });
      if (!updatedTemplateEnv) {
        const notFoundMessage = await this.i18n.translate(
          'errors.template.template_env_not_found',
          {
            lang: I18nContext.current().lang,
          },
        );
        throw new HttpException(notFoundMessage, HttpStatus.NOT_FOUND);
      }
      const successMessage = await this.i18n.translate(
        'messages.template.template_env_updated',
        {
          args: { id: updatedTemplateEnv.id },
          lang: I18nContext.current().lang,
        },
      );
      this.logger.log(successMessage);
      return plainToInstance(GetTemplateEnvDto, updatedTemplateEnv, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      const errorMessage = await this.i18n.translate(
        'errors.template.template_env_update_error',
        {
          lang: I18nContext.current().lang,
        },
      );
      this.logger.error(errorMessage, error.stack);
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async changeTemplateEnvStatus(
    id: number,
    status: boolean,
  ): Promise<GetTemplateEnvDto> {
    try {
      await this.templateEnvRepository.update(id, { status });
      const updatedTemplateEnv = await this.templateEnvRepository.findOne({
        where: { id },
      });
      if (!updatedTemplateEnv) {
        const notFoundMessage = await this.i18n.translate(
          'errors.template.template_env_not_found',
          {
            lang: I18nContext.current().lang,
          },
        );
        throw new HttpException(notFoundMessage, HttpStatus.NOT_FOUND);
      }
      const successMessage = await this.i18n.translate(
        'messages.template.status_changed',
        {
          args: { id: updatedTemplateEnv.id },
          lang: I18nContext.current().lang,
        },
      );
      this.logger.log(successMessage);
      return plainToInstance(GetTemplateEnvDto, updatedTemplateEnv, {
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

  async getTemplateEnvsPaginated(
    page: number,
    limit: number,
    name?: string,
    status?: boolean,
    createdAt?: string,
  ): Promise<{ TemplateEnvsPaginated: any; total: number }> {
    if (page < 1 || limit < 1) {
      const errorMessage = await this.i18n.translate(
        'errors.template.template_env_invalid_pagination_params',
        { lang: I18nContext.current().lang },
      );
      throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
    }

    try {
      const fetchingMessage = await this.i18n.translate(
        'messages.template.fetching_all_template_envs',
        { lang: I18nContext.current().lang },
      );
      this.logger.log(fetchingMessage);

      const queryBuilder =
        this.templateEnvRepository.createQueryBuilder('templateEnv');

      if (status !== undefined) {
        queryBuilder.andWhere('templateEnv.status = :status', { status });
      }

      if (name) {
        queryBuilder.andWhere('LOWER(templateEnv.name) LIKE LOWER(:name)', {
          name: `%${name}%`,
        });
      }

      if (createdAt) {
        queryBuilder.andWhere('DATE(templateEnv.createdAt) = :createdAt', {
          createdAt,
        });
      }

      const filteredTotal = await queryBuilder.getCount();

      queryBuilder.skip((page - 1) * limit).take(limit);

      const templateEnvs = await queryBuilder.getMany();

      const templateEnvDtos = templateEnvs.map((templateEnv) =>
        plainToInstance(GetTemplateEnvDto, templateEnv, {
          excludeExtraneousValues: true,
        }),
      );

      const fetchedMessage = await this.i18n.translate(
        'messages.template.fetched_template_envs',
        {
          args: { count: templateEnvDtos.length },
          lang: I18nContext.current().lang,
        },
      );
      this.logger.log(fetchedMessage);

      const totalPages = Math.ceil(filteredTotal / limit);

      const templateEnvsPaginated = {
        data: templateEnvDtos,
        filteredTotal,
        templateEnvsPerPage: templateEnvDtos.length,
        totalPages,
      };

      return {
        TemplateEnvsPaginated: templateEnvsPaginated,
        total: await this.templateEnvRepository.count(),
      };
    } catch (error) {
      const errorMessage = await this.i18n.translate(
        'errors.template.template_env_failed_to_retrieve_template_envs',
        { lang: I18nContext.current().lang },
      );
      this.logger.error(errorMessage, error.stack);
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
