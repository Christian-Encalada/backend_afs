import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quote } from './entity/quote.entity';
import { Tenant } from '@/tenant/tenant.entity';
import { User } from '@/user/user.entity';
import { RecurrenceQuote } from './entity/recurrQuote.entity';
import { QuoteService } from './quote.service';
import { QuoteController } from './quote.controller';
import { RecurrenceQuoteService } from './recurrQuote.service';
import { Client } from '@/client/client.entity';
import { RecurrenceQuoteController } from './recurrQuote.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Quote, Tenant, User, RecurrenceQuote, Client]),
  ],
  providers: [QuoteService, RecurrenceQuoteService],
  controllers: [QuoteController, RecurrenceQuoteController],
  exports: [QuoteService, RecurrenceQuoteService],
})
export class QuoteModule {}
