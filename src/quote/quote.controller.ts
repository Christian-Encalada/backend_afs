import {
  Controller,
  Post,
  Body,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Put,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { QuoteService } from './quote.service';
import { QuoteDto } from './dto/quote.dto';
import { Quote } from './entity/quote.entity';
import { QuoteGetDto } from './dto/quoteGet.dto';
import { I18n, I18nContext } from 'nestjs-i18n';

@Controller('quotes')
@ApiTags('quotes')
export class QuoteController {
  private readonly logger = new Logger(QuoteController.name);

  constructor(private readonly quoteService: QuoteService) {}

  // Request to get all quotes
  @Get()
  @ApiOperation({ summary: 'Get all quotes' })
  @ApiResponse({
    status: 200,
    description: 'Returns all quotes.',
    type: [QuoteGetDto],
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async findAll(@I18n() i18n: I18nContext): Promise<QuoteGetDto[]> {
    const lang = i18n.lang;
    this.logger.log(
      await i18n.t('messages.quote.fetching_all_quotes', { lang }),
    );
    try {
      return await this.quoteService.findAll();
    } catch (error) {
      this.logger.error(
        await i18n.t('errors.quote.error_fetching_quotes', { lang }),
        error.stack,
      );
      throw new HttpException(
        await i18n.t('errors.internal_server_error', { lang }),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Request to get a quote by ID
  @Get('/:id')
  @ApiOperation({ summary: 'Get a quote by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns a quote by ID.',
    type: [QuoteGetDto],
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async findOneById(
    @Param('id') id: number,
    @I18n() i18n: I18nContext,
  ): Promise<QuoteGetDto> {
    const lang = i18n.lang;
    this.logger.log(
      await i18n.t('messages.quote.fetching_quote', { args: { id }, lang }),
    );
    try {
      return await this.quoteService.findOneById(id);
    } catch (error) {
      this.logger.error(
        await i18n.t('errors.quote.quote_not_found', { args: { id }, lang }),
        error.stack,
      );
      throw new HttpException(
        await i18n.t('errors.quote.quote_not_found', { lang }),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Request to create a Quote
  @Post()
  @ApiOperation({ summary: 'Create a normal quote' })
  @ApiResponse({
    status: 201,
    description: 'The quote has been successfully created.',
    type: Quote,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async createQuote(
    @Body() createQuoteDto: QuoteDto,
    @I18n() i18n: I18nContext,
  ): Promise<Quote> {
    const lang = i18n.lang;
    this.logger.log(await i18n.t('messages.quote.creating_quote', { lang }));
    try {
      const quote = await this.quoteService.createQuote(createQuoteDto);
      this.logger.log(await i18n.t('messages.quote.quote_created', { lang }));
      return quote;
    } catch (error) {
      // See a HttpException throwed in services
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        await i18n.t('errors.quote.quote_creation_error', { lang }),
        error.stack,
      );
      throw new HttpException(
        await i18n.t('errors.quote.quote_creation_error', { lang }),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Request to update a Quote
  @Put('/:id')
  @ApiOperation({ summary: 'Update a quote' })
  @ApiResponse({
    status: 200,
    description: 'The quote has been successfully updated.',
    type: Quote,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  async updateQuote(
    @Param('id') id: number,
    @Body() quoteDto: QuoteDto,
    @I18n() i18n: I18nContext,
  ): Promise<Quote> {
    const lang = i18n.lang;

    this.logger.log(
      await i18n.t('messages.quote.updating_quote', { args: { id }, lang }),
    );

    try {
      const updatedQuote = await this.quoteService.updateQuote(id, quoteDto);
      this.logger.log(
        await i18n.t('messages.quote.quote_updated', {
          args: { id },
          lang,
        }),
      );
      return updatedQuote;
    } catch (error) {
      // See a HttpException throwed in services
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        await i18n.t('errors.quote.quote_update_error', {
          args: { id },
          lang,
        }),
        error.stack,
      );
      throw new HttpException(
        await i18n.t('errors.quote.quote_update_error', { lang }),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
