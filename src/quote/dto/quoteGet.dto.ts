import {
  IsNumber,
  ValidateNested,
  IsOptional,
  IsDate,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { GetUserDto } from '@/user/dto/getUser.dto';
import { RecurrenceQuoteGetDto } from './recurrQuoteGet.dto';
import { TenantDto } from '@/tenant/dto/tenant.dto';
import { GetClientDto } from '@/client/dto/getClient.dto';

export class QuoteGetDto {
  @IsNumber()
  @ApiProperty({ description: 'The id of the quote' })
  id: number;

  @IsDate()
  @ApiProperty({ description: 'The date the quote was created' })
  createdAt: Date;

  @IsDate()
  @ApiProperty({ description: 'The date the quote was last updated' })
  updatedAt: Date;

  @IsString()
  @ApiProperty({ description: 'The title of the quote' })
  title: string;

  @IsString()
  @ApiProperty({
    description: 'The description of the quote',
    required: false,
  })
  description?: string;

  @ValidateNested()
  @Type(() => GetUserDto)
  @ApiProperty({ description: 'The user associated with the quote' })
  user: GetUserDto;

  @ValidateNested()
  @Type(() => TenantDto)
  @ApiProperty({ description: 'The tenant of the quote' })
  tenat: TenantDto;

  @ValidateNested()
  @Type(() => GetClientDto)
  @ApiProperty({ description: 'The client related to the quote' })
  client: GetClientDto;

  @ValidateNested()
  @IsOptional()
  @Type(() => RecurrenceQuoteGetDto)
  @ApiProperty({
    description: 'The recurrence details if the quote is recurring',
    required: false,
  })
  recurrenceQuote?: RecurrenceQuoteGetDto;
}
