import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTemplateDefaultDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'The name of the template default' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'The content of the template default' })
  content: string;

  @IsString()
  @ApiProperty({ description: 'The status of the template default' })
  status: string;
}
