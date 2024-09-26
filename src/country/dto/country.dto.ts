import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CountryDto {
  @Expose()
  @IsNumber()
  @ApiProperty({ description: 'The id of the country' })
  id: number;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'The name of the country' })
  name: string;
}
