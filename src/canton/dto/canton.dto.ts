// src/canton/dto/canton.dto.ts
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CantonDto {
  @Expose()
  @IsNumber()
  @ApiProperty({ description: 'The id of the canton' })
  id: number;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'The name of the canton' })
  name: string;

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'The ID of the province' })
  id_province: number;
}
