import {
  IsString,
  IsNumber,
  ValidateNested,
  IsEnum,
  IsOptional,
  IsEmail,
  IsBoolean,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { TenantDto } from '@/tenant/dto/tenant.dto';
import { UserRole } from '../interface/userRole';
import { ParishDto } from '@/parish/dto/parish.dto';
import { CantonDto } from '@/canton/dto/canton.dto';
import { ProvinceDto } from '@/province/dto/province.dto';
import { CountryDto } from '@/country/dto/country.dto';

export class GetUserDto {
  @Expose()
  @IsNumber()
  @ApiProperty({ description: 'The id of the user' })
  id: number;

  @Expose()
  @IsString()
  @ApiProperty({ description: 'The username of the user' })
  username: string;

  @Expose()
  @IsEmail()
  @ApiProperty({ description: 'The email of the user' })
  email: string;

  @Expose()
  @IsEnum(UserRole)
  @ApiProperty({ description: 'The role of the user' })
  role: UserRole;

  @Expose()
  @ValidateNested()
  @Type(() => TenantDto)
  @ApiProperty({ description: 'The tenant of the user' })
  tenant?: TenantDto;

  @Expose()
  @IsBoolean()
  @ApiProperty({ description: 'The status of the user' })
  status: boolean;

  @Expose()
  @IsOptional()
  @ValidateNested()
  @Type(() => CountryDto)
  @ApiProperty({ description: 'The country of the user', required: false })
  country?: CountryDto;

  @Expose()
  @IsOptional()
  @ValidateNested()
  @Type(() => ProvinceDto)
  @ApiProperty({ description: 'The province of the user', required: false })
  province?: ProvinceDto;

  @Expose()
  @IsOptional()
  @ValidateNested()
  @Type(() => CantonDto)
  @ApiProperty({ description: 'The canton of the user', required: false })
  canton?: CantonDto;

  @Expose()
  @IsOptional()
  @ValidateNested()
  @Type(() => ParishDto)
  @ApiProperty({ description: 'The parish of the user', required: false })
  parish?: ParishDto;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'The document of the user', required: false })
  document?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'The phone number of the user', required: false })
  phone?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'The direction of the user', required: false })
  direction?: string;

  @Expose()
  @ApiProperty({ description: 'The date when the user was created' })
  createdAt: Date;

  @Expose()
  @ApiProperty({ description: 'The date when the user was updated' })
  updatedAt: Date;
}
