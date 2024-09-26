import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TemplateDefault } from './templateDefault.entity';
import { CreateTemplateDefaultDto } from './dto/createTemplateDefault.dto';
import { UpdateTemplateDefaultDto } from './dto/updateTemplateDefault.dto';
import { GetTemplateDefaultDto } from './dto/getTemplateDefault.dto';
import { plainToInstance } from 'class-transformer';
import { I18nService, I18nContext } from 'nestjs-i18n';

@Injectable()
export class TemplateDefaultService {
  private readonly logger = new Logger(TemplateDefaultService.name);

  constructor(
    @InjectRepository(TemplateDefault)
    private templateDefaultRepository: Repository<TemplateDefault>,
    private readonly i18n: I18nService,
  ) {}

  async createTemplateDefault(
    createTemplateDefaultDto: CreateTemplateDefaultDto,
  ): Promise<GetTemplateDefaultDto> {
    try {
      const templateDefault = this.templateDefaultRepository.create(
        createTemplateDefaultDto,
      );
      const savedTemplateDefault =
        await this.templateDefaultRepository.save(templateDefault);
      const successMessage = await this.i18n.translate(
        'messages.template.template_created',
        {
          args: { id: savedTemplateDefault.id },
          lang: I18nContext.current().lang,
        },
      );
      this.logger.log(successMessage);
      return plainToInstance(GetTemplateDefaultDto, savedTemplateDefault, {
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

  async updateTemplateDefault(
    id: number,
    updateTemplateDefaultDto: UpdateTemplateDefaultDto,
  ): Promise<GetTemplateDefaultDto> {
    try {
      await this.templateDefaultRepository.update(id, updateTemplateDefaultDto);
      const updatedTemplateDefault =
        await this.templateDefaultRepository.findOne({ where: { id } });
      if (!updatedTemplateDefault) {
        const notFoundMessage = await this.i18n.translate(
          'errors.template.template_not_found',
          {
            lang: I18nContext.current().lang,
          },
        );
        throw new HttpException(notFoundMessage, HttpStatus.NOT_FOUND);
      }
      const successMessage = await this.i18n.translate(
        'messages.template.template_updated',
        {
          args: { id: updatedTemplateDefault.id },
          lang: I18nContext.current().lang,
        },
      );
      this.logger.log(successMessage);
      return plainToInstance(GetTemplateDefaultDto, updatedTemplateDefault, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      const errorMessage = await this.i18n.translate(
        'errors.template.template_update_error',
        {
          lang: I18nContext.current().lang,
        },
      );
      this.logger.error(errorMessage, error.stack);
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async changeTemplateDefaultStatus(
    id: number,
    status: string,
  ): Promise<GetTemplateDefaultDto> {
    try {
      await this.templateDefaultRepository.update(id, { status });
      const updatedTemplateDefault =
        await this.templateDefaultRepository.findOne({ where: { id } });
      if (!updatedTemplateDefault) {
        const notFoundMessage = await this.i18n.translate(
          'errors.template.template_not_found',
          {
            lang: I18nContext.current().lang,
          },
        );
        throw new HttpException(notFoundMessage, HttpStatus.NOT_FOUND);
      }
      const successMessage = await this.i18n.translate(
        'messages.template.status_changed',
        {
          args: { id: updatedTemplateDefault.id },
          lang: I18nContext.current().lang,
        },
      );
      this.logger.log(successMessage);
      return plainToInstance(GetTemplateDefaultDto, updatedTemplateDefault, {
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

  async findAllTemplateDefaults(): Promise<GetTemplateDefaultDto[]> {
    try {
      const templateDefaults = await this.templateDefaultRepository.find();
      const successMessage = await this.i18n.translate(
        'messages.template.templates_retrieved',
        {
          lang: I18nContext.current().lang,
        },
      );
      this.logger.log(successMessage);
      return plainToInstance(GetTemplateDefaultDto, templateDefaults, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      const errorMessage = await this.i18n.translate(
        'errors.internal_server_error',
        {
          lang: I18nContext.current().lang,
        },
      );
      this.logger.error(errorMessage, error.stack);
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
