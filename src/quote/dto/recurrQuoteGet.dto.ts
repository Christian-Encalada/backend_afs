import { IsEnum, IsNumber, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  DaysOfWeek,
  Frequency,
  MonthsOfYear,
} from '../interface/recurrQuoteEnums';

export class RecurrenceQuoteGetDto {
  @IsNumber()
  @ApiProperty({ description: 'The id of the recurrence quote' })
  id: number;

  @IsEnum(Frequency)
  @ApiProperty({ description: 'The frequency of recurrence' })
  frequency: Frequency;

  @IsNumber()
  @ApiProperty({ description: 'The interval of recurrence' })
  interval: number;

  @IsEnum(DaysOfWeek, { each: true })
  @IsOptional()
  @ApiProperty({
    description: 'The days of the week for recurrence',
    type: [String],
  })
  daysOfWeek?: DaysOfWeek[];

  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: 'The day of the month for recurrence' })
  dayOfMonth?: number;

  @IsEnum(MonthsOfYear, { each: true })
  @IsOptional()
  @ApiProperty({
    description: 'The months of the year for recurrence',
    type: [String],
  })
  monthsOfYear?: MonthsOfYear[];

  @IsDateString()
  @IsOptional()
  @ApiProperty({ description: 'The end date of the recurrence' })
  endDateRecurr?: Date;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: 'The number of occurrences' })
  occurrences?: number;
}
