import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTemplateActionDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'The name of the template action' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'The description of the template action' })
  description: string;

  @IsBoolean()
  @ApiProperty({
    description: 'The status of the template action',
    default: true,
  })
  status: boolean;
}
