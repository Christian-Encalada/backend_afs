import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { TenantDto } from '@/tenant/dto/tenant.dto';

export class SiteGetDto {
  @IsNumber()
  @ApiProperty({ description: 'The id of the quote' })
  id: number;

  @IsString()
  @ApiProperty({ description: 'The name of the site' })
  name: string;

  @IsString()
  @ApiProperty({ description: 'The description of the site' })
  description?: string;

  @IsString()
  @ApiProperty({ description: 'The primary color of the site' })
  primaryColor?: string;

  @IsString()
  @ApiProperty({ description: 'The primary color of the site' })
  secondaryColor?: string;

  @IsString()
  @ApiProperty({ description: 'Logo of the site' })
  logo?: string;

  @IsDate()
  @ApiProperty({ description: 'Date of the site was created' })
  createdAt: Date;

  @IsBoolean()
  @ApiProperty({ description: 'The status of the site' })
  status: boolean;

  @ValidateNested()
  @Type(() => TenantDto)
  @ApiProperty({ description: 'The id for the tenant' })
  tenant: TenantDto;
}
