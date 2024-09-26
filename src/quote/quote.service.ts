import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quote } from '@/quote/entity/quote.entity';
import { RecurrenceQuote } from './entity/recurrQuote.entity';
import { User } from '@/user/user.entity';
import { Tenant } from '@/tenant/tenant.entity';
import { QuoteDto } from './dto/quote.dto';
import { QuoteGetDto } from './dto/quoteGet.dto';
import { plainToInstance } from 'class-transformer';
import { I18nService, I18nContext } from 'nestjs-i18n';
import { Client } from '@/client/client.entity';

@Injectable()
export class QuoteService {
  private readonly logger = new Logger(QuoteService.name);

  constructor(
    @InjectRepository(Quote)
    private readonly quoteRepository: Repository<Quote>,
    @InjectRepository(RecurrenceQuote)
    private readonly recurrenceQuoteRepository: Repository<RecurrenceQuote>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    // Languaje Service
    private readonly i18n: I18nService,
  ) {}

  // Find All quotes in a Tenant
  async findAll(): Promise<QuoteGetDto[]> {
    const lang = I18nContext.current().lang;
    this.logger.log(
      await this.i18n.t('messages.quote.fetching_all_quotes', { lang }),
    );
    try {
      const quotes = await this.quoteRepository.find({
        relations: ['user', 'tenant'],
      });

      // Verify if the quote has a recurrence
      const quotesWithRecurrence = await Promise.all(
        quotes.map(async (quote) => {
          const recurrenceQuote = await this.recurrenceQuoteRepository.findOne({
            where: { quote: { id: quote.id } },
          });
          return { ...quote, recurrenceQuote };
        }),
      );

      this.logger.log(
        await this.i18n.t('messages.quote.fetched_quotes', {
          args: { count: quotesWithRecurrence.length },
          lang,
        }),
      );
      return quotesWithRecurrence.map((quote) =>
        plainToInstance(QuoteGetDto, quote),
      );
    } catch (error) {
      this.logger.error(
        await this.i18n.t('errors.quote.error_fetching_quotes', { lang }),
        error.stack,
      );
      const errorMessage = await this.i18n.t(
        'errors.quote.error_fetching_quotes',
        { lang },
      );
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOneById(id: number): Promise<QuoteGetDto> {
    const lang = I18nContext.current().lang;
    this.logger.log(
      await this.i18n.t('messages.quote.fetching_quote', {
        args: { id },
        lang,
      }),
    );
    const quote = await this.quoteRepository.findOne({
      where: { id },
      relations: ['user', 'tenant'],
    });

    if (!quote) {
      this.logger.error(
        await this.i18n.t('errors.quote.quote_not_found', {
          args: { id },
          lang,
        }),
      );
      const errorMessage = await this.i18n.t('errors.quote.quote_not_found', {
        lang,
      });
      throw new HttpException(errorMessage, HttpStatus.NOT_FOUND);
    }

    const recurrenceQuote = await this.recurrenceQuoteRepository.findOne({
      where: { quote: { id: quote.id } },
    });

    return plainToInstance(QuoteGetDto, { ...quote, recurrenceQuote });
  }

  // Create a Normal Quote
  async createQuote(quoteDto: QuoteDto): Promise<Quote> {
    const lang = I18nContext.current().lang;
    const { userId, tenantId, clientId, title, description } = quoteDto;

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      this.logger.error(
        await this.i18n.t('errors.user.user_not_found', {
          args: { userId },
          lang,
        }),
      );
      const errorMessage = await this.i18n.t('errors.user.user_not_found', {
        lang,
      });
      throw new HttpException(errorMessage, HttpStatus.NOT_FOUND);
    }

    const tenant = await this.tenantRepository.findOne({
      where: { id: tenantId },
    });

    if (!tenant) {
      this.logger.error(
        await this.i18n.t('errors.tenant.tenant_not_found', {
          args: { tenantId },
          lang,
        }),
      );
      const errorMessage = await this.i18n.t('errors.tenant.tenant_not_found', {
        lang,
      });
      throw new HttpException(errorMessage, HttpStatus.NOT_FOUND);
    }

    const client = await this.clientRepository.findOne({
      where: { id: clientId },
    });

    if (!client) {
      this.logger.error(
        await this.i18n.t('errors.client.client_not_found', {
          args: { clientId },
          lang,
        }),
      );
      const errorMessage = await this.i18n.t('errors.client.client_not_found', {
        lang,
      });
      throw new HttpException(errorMessage, HttpStatus.NOT_FOUND);
    }

    let newQuote: any;
    try {
      newQuote = this.quoteRepository.create({
        user,
        tenant,
        title,
        description,
        client,
      });
      this.logger.log(
        await this.i18n.t('messages.quote.quote_created', { lang }),
      );
    } catch (error) {
      this.logger.error(
        await this.i18n.t('error.quote.quote_creation_error', { lang }),
        error.stack,
      );
      const errorMessage = await this.i18n.t(
        'error.quote.quote_creation_error',
        { lang },
      );
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return this.quoteRepository.save(newQuote);
  }

  // Update a Quote
  async updateQuote(id: number, quoteDto: QuoteDto): Promise<Quote> {
    const lang = I18nContext.current().lang;
    const { userId, tenantId, clientId, title, description } = quoteDto;

    const quote = await this.quoteRepository.findOne({
      where: { id },
      relations: ['user', 'tenant', 'client'],
    });

    if (!quote) {
      const errorMessage = await this.i18n.t('errors.quote.quote_not_found', {
        lang,
      });
      this.logger.error(`${errorMessage}: ID ${id}`);
      throw new HttpException(errorMessage, HttpStatus.NOT_FOUND);
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      this.logger.error(
        await this.i18n.t('errors.user.user_not_found', {
          args: { userId },
          lang,
        }),
      );
      const errorMessage = await this.i18n.t('errors.user.user_not_found', {
        lang,
      });
      throw new HttpException(errorMessage, HttpStatus.NOT_FOUND);
    }

    const tenant = await this.tenantRepository.findOne({
      where: { id: tenantId },
    });

    if (!tenant) {
      this.logger.error(
        await this.i18n.t('errors.tenant.tenant_not_found', {
          args: { tenantId },
          lang,
        }),
      );
      const errorMessage = await this.i18n.t('errors.tenant.tenant_not_found', {
        lang,
      });
      throw new HttpException(errorMessage, HttpStatus.NOT_FOUND);
    }

    const client = await this.clientRepository.findOne({
      where: { id: clientId },
    });

    if (!client) {
      this.logger.error(
        await this.i18n.t('errors.client.client_not_found', {
          args: { clientId },
          lang,
        }),
      );
      const errorMessage = await this.i18n.t('errors.client.client_not_found', {
        lang,
      });
      throw new HttpException(errorMessage, HttpStatus.NOT_FOUND);
    }

    quote.title = title;
    quote.description = description;

    try {
      await this.quoteRepository.save(quote);
    } catch (error) {
      const errorMessage = await this.i18n.t(
        'errors.quote.quote_update_error',
        {
          lang,
        },
      );
      this.logger.error(errorMessage, error.stack);
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return quote;
  }
}
