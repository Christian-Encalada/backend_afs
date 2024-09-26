// src/parish/dto/parish.dto.ts
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ParishDto {
  @Expose()
  @IsNumber()
  @ApiProperty({ description: 'The id of the parish' })
  id: number;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'The name of the parish' })
  name: string;

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'The ID of the province' })
  id_province: number;

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'The ID of the canton' })
  id_canton: number;
}
