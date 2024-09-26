import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsEmail,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PersonDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: 'The email of the person' })
  email: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'The document of the person' })
  document: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'The phone number of the person' })
  phone: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'The direction of the person' })
  direction: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: 'The country ID of the person' })
  countryId: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: 'The province ID of the person' })
  provinceId: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: 'The canton ID of the person' })
  cantonId: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: 'The parish ID of the person' })
  parishId: number;
}
