import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Canton } from './canton.entity';
import { CantonDto } from './dto/canton.dto';
import { Province } from '@/province/province.entity';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class CantonService {
  private readonly logger = new Logger(CantonService.name);

  constructor(
    private readonly i18n: I18nService,
    @InjectRepository(Canton)
    private cantonRepository: Repository<Canton>,
    @InjectRepository(Province)
    private readonly provinceRepository: Repository<Province>,
  ) {}

  async createCanton(cantonDto: CantonDto): Promise<Canton> {
    const { name, id_province } = cantonDto;

    const province = await this.provinceRepository.findOne({
      where: { id: id_province },
    });

    if (!province) {
      const errorMsg = await this.i18n.translate(
        'errors.province.province_not_found',
        {
          args: { id_province },
          lang: I18nContext.current().lang,
        },
      );
      this.logger.error(errorMsg);
      throw new HttpException(errorMsg, HttpStatus.NOT_FOUND);
    }

    let newCanton;
    try {
      newCanton = this.cantonRepository.create({
        name,
        province,
      });
    } catch (error) {
      const errorMsg = await this.i18n.translate(
        'errors.internal_server_error',
        {
          args: { error: error.message },
          lang: I18nContext.current().lang,
        },
      );
      this.logger.error(`${errorMsg} - ${error.stack}`);
      throw new HttpException(errorMsg, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const successMsg = await this.i18n.translate(
      'messages.canton.canton_created',
      {
        args: { name },
        lang: I18nContext.current().lang,
      },
    );
    this.logger.log(successMsg);
    return this.cantonRepository.save(newCanton);
  }

  async getAllCantonsByProvince(provinceId: number): Promise<Canton[]> {
    const province = await this.provinceRepository.findOne({
      where: { id: provinceId },
    });

    if (!province) {
      const errorMsg = await this.i18n.translate(
        'errors.province.province_not_found',
        {
          args: { id_province: provinceId },
          lang: I18nContext.current().lang,
        },
      );
      this.logger.error(errorMsg);
      throw new HttpException(errorMsg, HttpStatus.NOT_FOUND);
    }

    try {
      const fetchingMessage = await this.i18n.translate(
        'messages.canton.fetching_cantons',
        {
          lang: I18nContext.current().lang,
        },
      );

      this.logger.log(fetchingMessage);

      const canton = await this.cantonRepository.find({
        where: { province: { id: provinceId } },
        relations: ['province'],
      });

      const successMsg = await this.i18n.translate(
        'messages.canton.cantons_retrieved',
        {
          lang: I18nContext.current().lang,
        },
      );

      this.logger.log(successMsg);

      return canton;
    } catch (error) {
      const errorMsg = await this.i18n.translate(
        'errors.internal_server_error',
        {
          args: { error: error.message },
          lang: I18nContext.current().lang,
        },
      );
      this.logger.error(`${errorMsg} - ${error.stack}`);
      throw new HttpException(errorMsg, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllCantons(): Promise<Canton[]> {
    try {
      const fetchingMessage = await this.i18n.translate(
        'messages.canton.fetching_cantons',
        {
          lang: I18nContext.current().lang,
        },
      );

      this.logger.log(fetchingMessage);

      const canton = await this.cantonRepository.find({
        relations: ['province'],
      });

      const successMsg = await this.i18n.translate(
        'messages.canton.cantons_retrieved',
        {
          lang: I18nContext.current().lang,
        },
      );

      this.logger.log(successMsg);

      return canton;
    } catch (error) {
      const errorMsg = await this.i18n.translate(
        'errors.internal_server_error',
        {
          args: { error: error.message },
          lang: I18nContext.current().lang,
        },
      );
      this.logger.error(`${errorMsg} - ${error.stack}`);
      throw new HttpException(errorMsg, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
