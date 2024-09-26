import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Province } from './province.entity';
import { ProvinceDto } from './dto/province.dto';
import { Country } from '@/country/country.entity';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class ProvinceService {
  private readonly logger = new Logger(ProvinceService.name);

  constructor(
    private readonly i18n: I18nService,
    @InjectRepository(Province)
    private provinceRepository: Repository<Province>,
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
  ) {}

  async createProvince(provinceDto: ProvinceDto): Promise<Province> {
    const { name, id_country } = provinceDto;

    const country = await this.countryRepository.findOne({
      where: { id: id_country },
    });

    if (!country) {
      const errorMsg = await this.i18n.translate(
        'errors.country.country_not_found',
        {
          args: { id_country },
          lang: I18nContext.current().lang,
        },
      );
      this.logger.error(errorMsg);
      throw new HttpException(errorMsg, HttpStatus.NOT_FOUND);
    }

    let newProvince;
    try {
      newProvince = this.provinceRepository.create({
        name,
        country,
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
      'messages.province.province_created',
      {
        args: { name },
        lang: I18nContext.current().lang,
      },
    );
    this.logger.log(successMsg);
    return this.provinceRepository.save(newProvince);
  }

  async getAllProvincesByCountry(countryId: number): Promise<Province[]> {
    const country = await this.countryRepository.findOne({
      where: { id: countryId },
    });

    if (!country) {
      const errorMsg = await this.i18n.translate(
        'errors.country.country_not_found',
        {
          args: { id_country: countryId },
          lang: I18nContext.current().lang,
        },
      );
      this.logger.error(errorMsg);
      throw new HttpException(errorMsg, HttpStatus.NOT_FOUND);
    }

    try {
      const fetchingMessage = await this.i18n.translate(
        'messages.province.fetching_provinces',
        {
          lang: I18nContext.current().lang,
        },
      );
      this.logger.log(fetchingMessage);

      const provinces = await this.provinceRepository.find({
        where: { country: { id: countryId } },
        relations: ['country'],
      });

      const successMsg = await this.i18n.translate(
        'messages.province.provinces_retrieved',
        {
          lang: I18nContext.current().lang,
        },
      );

      this.logger.log(successMsg);
      return provinces;
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
