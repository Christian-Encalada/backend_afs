import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from './country.entity';
import { CountryDto } from './dto/country.dto';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class CountryService {
  private readonly logger = new Logger(CountryService.name);

  constructor(
    private readonly i18n: I18nService,
    @InjectRepository(Country)
    private countryRepository: Repository<Country>,
  ) {}

  async findAllCountries(): Promise<Country[]> {
    try {
      const countries = await this.countryRepository.find();
      const successMsg = await this.i18n.translate(
        'messages.country.fetched_countries',
        {
          args: { count: countries.length },
          lang: I18nContext.current().lang,
        },
      );
      this.logger.log(successMsg);
      return countries;
    } catch (error) {
      const errorMsg = await this.i18n.translate(
        'errors.country.country_fetch_error',
        {
          args: { error: error.message },
          lang: I18nContext.current().lang,
        },
      );
      this.logger.error(`${errorMsg} - ${error.stack}`);
      throw new HttpException(errorMsg, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createCountry(countryDto: CountryDto): Promise<Country> {
    const { name } = countryDto;

    let newCountry;
    try {
      newCountry = this.countryRepository.create({
        name,
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
      'messages.country.country_created',
      {
        args: { name },
        lang: I18nContext.current().lang,
      },
    );
    this.logger.log(successMsg);
    return this.countryRepository.save(newCountry);
  }
}
