import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  DaysOfWeek,
  Frequency,
  MonthsOfYear,
} from '../interface/recurrQuoteEnums';

export class RecurrenceQuoteDto {
  @IsEnum(Frequency, { each: true })
  @IsNotEmpty()
  @ApiProperty({ description: 'Type of frequency (daily, weekly, etc.)' })
  frequency: Frequency;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'Indicates how many times it is repeated' })
  interval: number;

  @IsEnum(DaysOfWeek, { each: true })
  @IsOptional()
  @ApiProperty({
    description: 'Days of week in which the event occurs',
    type: [String],
  })
  daysOfWeek?: DaysOfWeek[];

  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: 'Day of the month in which the event occurs' })
  dayOfMonth?: number;

  @IsEnum(MonthsOfYear, { each: true })
  @IsOptional()
  @ApiProperty({
    description: 'Months of the year in which the event occurs',
    type: [String],
  })
  monthsOfYear?: MonthsOfYear[];

  @IsDateString()
  @IsOptional()
  @ApiProperty({ description: 'The end date of the event' })
  endDateRecurr?: Date;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: 'Times that repeat the event' })
  occurrences?: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'The id for quote' })
  quoteId: number;
}
