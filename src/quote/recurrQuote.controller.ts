import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Logger,
  Put,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RecurrenceQuoteService } from './recurrQuote.service';
import { RecurrenceQuote } from './entity/recurrQuote.entity';
import { RecurrenceQuoteDto } from './dto/recurrQuote.dto';
import { I18n, I18nContext } from 'nestjs-i18n';

@Controller('quotes/recurrence')
@ApiTags('quotes/srecurrence')
export class RecurrenceQuoteController {
  private readonly logger = new Logger(RecurrenceQuoteController.name);

  constructor(
    private readonly recurrenceQuoteService: RecurrenceQuoteService,
  ) {}

  // Request to create a recurrence Quote
  @Post()
  @ApiOperation({ summary: 'Create a recurrence quote' })
  @ApiResponse({
    status: 201,
    description: 'The recurrence quote has been successfully created.',
    type: RecurrenceQuote,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async createRecurrenceQuote(
    @Body() createRecurrenceQuoteDto: RecurrenceQuoteDto,
    @I18n() i18n: I18nContext,
  ): Promise<RecurrenceQuote> {
    const lang = i18n.lang;
    if (!createRecurrenceQuoteDto.quoteId) {
      throw new HttpException(
        await i18n.t('errors.quote.quote_id_required', { lang }),
        HttpStatus.BAD_REQUEST,
      );
    }
    this.logger.log(
      await i18n.t('messages.quote.creating_recurrence_quote', { lang }),
    );
    try {
      const recurrenceQuote =
        await this.recurrenceQuoteService.createRecurrenceQuote(
          createRecurrenceQuoteDto,
        );
      this.logger.log(
        await i18n.t('messages.quote.recurrence_quote_created', { lang }),
      );
      return recurrenceQuote;
    } catch (error) {
      this.logger.error(
        await i18n.t('errors.quote.recurrence_quote_creation_error', { lang }),
        error.stack,
      );
      throw new HttpException(
        await i18n.t('errors.quote.recurrence_quote_creation_error', { lang }),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Request to update a recurrence Quote
  @Put(':id')
  @ApiOperation({ summary: 'Update a recurrence quote' })
  @ApiResponse({
    status: 200,
    description: 'The recurrence quote has been successfully updated.',
    type: RecurrenceQuote,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  async updateRecurrenceQuote(
    @Param('id') id: number,
    @Body() RecurrQuoteDto: RecurrenceQuoteDto,
    @I18n() i18n: I18nContext,
  ): Promise<RecurrenceQuote> {
    const lang = i18n.lang;
    if (!RecurrQuoteDto.quoteId) {
      throw new HttpException(
        await i18n.t('errors.quote.quote_id_required', { lang }),
        HttpStatus.BAD_REQUEST,
      );
    }
    this.logger.log(
      await i18n.t('messages.quote.updating_recurrence_quote', {
        args: { id },
        lang,
      }),
    );
    try {
      const updatedRecurrenceQuote =
        await this.recurrenceQuoteService.updateRecurrenceQuote(
          id,
          RecurrQuoteDto,
        );
      this.logger.log(
        await i18n.t('messages.quote.recurrence_quote_updated', {
          args: { id },
          lang,
        }),
      );
      return updatedRecurrenceQuote;
    } catch (error) {
      this.logger.error(
        await i18n.t('errors.quote.recurrence_quote_update_error', {
          args: { id },
          lang,
        }),
        error.stack,
      );
      throw new HttpException(
        await i18n.t('errors.quote.recurrence_quote_update_error', { lang }),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
