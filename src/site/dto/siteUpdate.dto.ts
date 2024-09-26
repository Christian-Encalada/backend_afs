import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Multer } from 'multer';
import { Template } from '@/site/interface/siteEnum';

export class SiteUpdateDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'The description of the site' })
  description?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'The primary color of the site' })
  primaryColor?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'The secondary color of the site' })
  secondaryColor?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'The template of colors for the site' })
  template?: Template;

  @IsOptional()
  @ApiProperty({ description: 'Logo of the site' })
  logo?: Multer.File;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ description: 'The status of the site' })
  status?: boolean;
}
