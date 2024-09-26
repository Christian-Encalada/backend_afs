// src/province/dto/province.dto.ts
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ProvinceDto {
  @Expose()
  @IsNumber()
  @ApiProperty({ description: 'The id of the province' })
  id: number;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'The name of the province' })
  name: string;

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'The ID of the country' })
  id_country: number;
}
