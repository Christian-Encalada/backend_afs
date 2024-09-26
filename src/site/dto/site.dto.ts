import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Multer } from 'multer';
import { Template } from '@/site/interface/siteEnum';

export class SiteDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9-_]+$/, {
    message: 'site name cannot contain spaces',
  })
  @ApiProperty({ description: 'The name of the site' })
  name: string;

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

  @IsEnum(Template)
  @IsOptional()
  @ApiProperty({ description: 'The template of colors for the site' })
  template?: Template;

  @IsOptional()
  @ApiProperty({ description: 'Logo of the site' })
  logo?: Multer.File;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ description: 'The status of the site' })
  status: boolean;
}
