import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecurrenceQuote } from './entity/recurrQuote.entity';
import { Quote } from '@/quote/entity/quote.entity';
import { RecurrenceQuoteDto } from './dto/recurrQuote.dto';
import { I18nService, I18nContext } from 'nestjs-i18n';

@Injectable()
export class RecurrenceQuoteService {
  private readonly logger = new Logger(RecurrenceQuoteService.name);

  constructor(
    @InjectRepository(RecurrenceQuote)
    private readonly recurrenceQuoteRepository: Repository<RecurrenceQuote>,
    @InjectRepository(Quote)
    private readonly quoteRepository: Repository<Quote>,
    private readonly i18n: I18nService,
  ) {}

  // Create a Recurrence Quote
  async createRecurrenceQuote(
    recurrenceQuoteDto: RecurrenceQuoteDto,
  ): Promise<RecurrenceQuote> {
    const lang = I18nContext.current().lang;
    const {
      quoteId,
      frequency,
      interval,
      daysOfWeek,
      dayOfMonth,
      monthsOfYear,
      endDateRecurr,
      occurrences,
    } = recurrenceQuoteDto;

    const quote = await this.quoteRepository.findOne({
      where: { id: quoteId },
    });

    if (!quote) {
      const errorMessage = await this.i18n.t('errors.quote.quote_not_found', {
        lang,
      });
      this.logger.error(`${errorMessage}: Quote ID ${quoteId}`);
      throw new HttpException(errorMessage, HttpStatus.NOT_FOUND);
    }

    // Validate the frequency field
    switch (frequency) {
      case 'weekly':
        if (!daysOfWeek || daysOfWeek.length === 0) {
          const errorMessage = await this.i18n.t(
            'errors.recurrence.days_of_week_required',
            { lang },
          );
          this.logger.error(errorMessage);
          throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
        }
        break;
      case 'monthly':
        if (!dayOfMonth) {
          const errorMessage = await this.i18n.t(
            'errors.recurrence.day_of_month_required',
            { lang },
          );
          this.logger.error(errorMessage);
          throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
        }
        break;
      case 'yearly':
        if (!monthsOfYear || monthsOfYear.length === 0) {
          const errorMessage = await this.i18n.t(
            'errors.recurrence.months_of_year_required',
            { lang },
          );
          this.logger.error(errorMessage);
          throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
        }
        break;

      default:
        break;
    }

    let newRecurrenceQuote: RecurrenceQuote;
    try {
      newRecurrenceQuote = this.recurrenceQuoteRepository.create({
        quote,
        frequency,
        interval,
        daysOfWeek,
        dayOfMonth,
        monthsOfYear,
        endDateRecurr,
        occurrences,
      });
    } catch (error) {
      const errorMessage = await this.i18n.t(
        'errors.recurrence.creation_error',
        { lang },
      );
      this.logger.error(errorMessage, error.stack);
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return this.recurrenceQuoteRepository.save(newRecurrenceQuote);
  }

  // Update a Recurrence Quote
  async updateRecurrenceQuote(
    id: number,
    recurrQuoteDto: RecurrenceQuoteDto,
  ): Promise<RecurrenceQuote> {
    const lang = I18nContext.current().lang;
    const {
      quoteId,
      frequency,
      interval,
      daysOfWeek,
      dayOfMonth,
      monthsOfYear,
      endDateRecurr,
      occurrences,
    } = recurrQuoteDto;

    const recurrenceQuote = await this.recurrenceQuoteRepository.findOne({
      where: { id },
      relations: ['quote'],
    });

    if (!recurrenceQuote) {
      const errorMessage = await this.i18n.t(
        'errors.recurrence.recurrence_quote_not_found',
        { lang },
      );
      this.logger.error(`${errorMessage}: ID ${id}`);
      throw new HttpException(errorMessage, HttpStatus.NOT_FOUND);
    }

    const quote = await this.quoteRepository.findOne({
      where: { id: quoteId },
    });

    if (!quote) {
      const errorMessage = await this.i18n.t('errors.quote.quote_not_found', {
        lang,
      });
      this.logger.error(`${errorMessage}: Quote ID ${quoteId}`);
      throw new HttpException(errorMessage, HttpStatus.NOT_FOUND);
    }

    recurrenceQuote.frequency = frequency;
    recurrenceQuote.interval = interval;
    recurrenceQuote.daysOfWeek = daysOfWeek;
    recurrenceQuote.dayOfMonth = dayOfMonth;
    recurrenceQuote.monthsOfYear = monthsOfYear;
    recurrenceQuote.endDateRecurr = endDateRecurr;
    recurrenceQuote.occurrences = occurrences;

    try {
      await this.recurrenceQuoteRepository.save(recurrenceQuote);
      await this.quoteRepository.update(quoteId, { updatedAt: new Date() });
    } catch (error) {
      const errorMessage = await this.i18n.t('errors.recurrence.update_error', {
        lang,
      });
      this.logger.error(errorMessage, error.stack);
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return recurrenceQuote;
  }
}
