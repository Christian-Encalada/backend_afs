import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class QuoteDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'The id for user' })
  userId: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'The id for tenant' })
  tenantId: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'The id for the client' })
  clientId: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'The title of the quote' })
  title: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'The description of the quote' })
  description?: string;
}
