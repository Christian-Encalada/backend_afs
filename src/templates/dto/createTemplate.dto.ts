import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTemplateDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'The name of the template' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'The content of the template' })
  content: string;

  @IsNumber()
  @ApiProperty({ description: 'The action associated with the template' })
  action: number;

  @IsArray()
  @ApiProperty({
    description: 'List of TemplateEnv IDs associated with the template',
  })
  templateEnvIds: number[];

  @IsBoolean()
  @ApiProperty({ description: 'The status of the template' })
  status: boolean;

  @IsBoolean()
  @ApiProperty({ description: 'The activation status of the template' })
  activate: boolean;
}
