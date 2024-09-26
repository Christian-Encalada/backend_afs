import { CantonDto } from '@/canton/dto/canton.dto';
import { CountryDto } from '@/country/dto/country.dto';
import { ParishDto } from '@/parish/dto/parish.dto';
import { ProvinceDto } from '@/province/dto/province.dto';
import { TenantDto } from '@/tenant/dto/tenant.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class GetClientDto {
  @Expose()
  @IsNumber()
  @ApiProperty({ description: 'The id of the client' })
  id: number;

  @Expose()
  @IsString()
  @ApiProperty({ description: 'The name of the client' })
  name: string;

  @Expose()
  @IsString()
  @ApiProperty({ description: 'The last name of the client' })
  lastName: string;

  @Expose()
  @IsEmail()
  @ApiProperty({ description: 'The email of the client' })
  email: string;

  @Expose()
  @ValidateNested()
  @Type(() => TenantDto)
  @ApiProperty({ description: 'The tenant of the client' })
  tenant?: TenantDto;

  @Expose()
  @IsOptional()
  @ValidateNested()
  @Type(() => CountryDto)
  @ApiProperty({ description: 'The country of the client', required: false })
  country?: CountryDto;

  @Expose()
  @IsOptional()
  @ValidateNested()
  @Type(() => ProvinceDto)
  @ApiProperty({ description: 'The province of the client', required: false })
  province?: ProvinceDto;

  @Expose()
  @IsOptional()
  @ValidateNested()
  @Type(() => CantonDto)
  @ApiProperty({ description: 'The canton of the client', required: false })
  canton?: CantonDto;

  @Expose()
  @IsOptional()
  @ValidateNested()
  @Type(() => ParishDto)
  @ApiProperty({ description: 'The parish of the client', required: false })
  parish?: ParishDto;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'The document of the client', required: false })
  document?: string;

  @Expose()
  @IsOptional()
  @IsPhoneNumber()
  @ApiProperty({
    description: 'The phone number of the client',
    required: false,
  })
  phone?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'The direction of the client', required: false })
  direction?: string;

  @Expose()
  @ApiProperty({ description: 'The date of creation of the client' })
  createdAt: Date;

  @Expose()
  @ApiProperty({ description: 'The date of the last update of the client' })
  updateAt: Date;

  @Expose()
  @ApiProperty({ description: 'The status of the client' })
  deleted: boolean;
}
