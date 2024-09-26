import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class SiteGetFilterDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || undefined)
  @ApiProperty({ description: 'The name of the site' })
  name?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || undefined)
  @ApiProperty({ description: 'Date of the site was created' })
  createdAt?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) =>
    value === 'true'
      ? true
      : value === 'false'
        ? false
        : value === 'undefined'
          ? undefined
          : value,
  )
  @ApiProperty({ description: 'The status of the site' })
  status?: boolean | undefined;

  @IsOptional()
  @IsInt()
  @Min(1, { message: 'Page must be greater than 1' })
  @Transform(({ value }) => parseInt(value, 10))
  @ApiPropertyOptional({ description: 'Page number for pagination' })
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(1, { message: 'Limit must be greater than 1' })
  @Transform(({ value }) => parseInt(value, 10))
  @ApiPropertyOptional({ description: 'Limit of items per page' })
  limit?: number;
}
