import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Parish } from './parish.entity';
import { ParishDto } from './dto/parish.dto';
import { Province } from '@/province/province.entity';
import { Canton } from '@/canton/canton.entity';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class ParishService {
  private readonly logger = new Logger(ParishService.name);

  constructor(
    private readonly i18n: I18nService,
    @InjectRepository(Parish)
    private parishRepository: Repository<Parish>,
    @InjectRepository(Province)
    private readonly provinceRepository: Repository<Province>,
    @InjectRepository(Canton)
    private readonly cantonRepository: Repository<Canton>,
  ) {}

  async createParish(parishDto: ParishDto): Promise<Parish> {
    const { name, id_province, id_canton } = parishDto;

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

    const canton = await this.cantonRepository.findOne({
      where: { id: id_canton },
    });

    if (!canton) {
      const errorMsg = await this.i18n.translate(
        'errors.canton.canton_not_found',
        {
          args: { id_canton },
          lang: I18nContext.current().lang,
        },
      );
      this.logger.error(errorMsg);
      throw new HttpException(errorMsg, HttpStatus.NOT_FOUND);
    }

    let newParish;
    try {
      newParish = this.parishRepository.create({
        name,
        province,
        canton,
      });
    } catch (error) {
      const errorMsg = await this.i18n.translate(
        'errors.parish.parish_creation_error',
        {
          args: { error: error.message },
          lang: I18nContext.current().lang,
        },
      );
      this.logger.error(`${errorMsg} - ${error.stack}`);
      throw new HttpException(errorMsg, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const successMsg = await this.i18n.translate(
      'messages.parish.parish_created',
      {
        args: { name },
        lang: I18nContext.current().lang,
      },
    );
    this.logger.log(successMsg);
    return this.parishRepository.save(newParish);
  }

  async getAllParishesByCanton(cantonId: number): Promise<Parish[]> {
    const canton = await this.cantonRepository.findOne({
      where: { id: cantonId },
    });

    if (!canton) {
      const errorMsg = await this.i18n.translate(
        'errors.canton.canton_not_found',
        {
          args: { id_canton: cantonId },
          lang: I18nContext.current().lang,
        },
      );
      this.logger.error(errorMsg);
      throw new HttpException(errorMsg, HttpStatus.NOT_FOUND);
    }

    try {
      const fetchingMessage = await this.i18n.translate(
        'messages.parish.fetching_parishes',
        {
          lang: I18nContext.current().lang,
        },
      );

      this.logger.log(fetchingMessage);

      const parishes = await this.parishRepository.find({
        where: { canton: { id: cantonId } },
        relations: ['canton', 'province'],
      });

      const successMsg = await this.i18n.translate(
        'messages.parish.parishes_retrieved',
        {
          lang: I18nContext.current().lang,
        },
      );

      this.logger.log(successMsg);

      return parishes;
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
