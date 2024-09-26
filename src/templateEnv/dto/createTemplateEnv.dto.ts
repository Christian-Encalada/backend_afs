import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTemplateEnvDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'The environment variable' })
  env: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'The description of the environment variable' })
  description: string;

  @IsBoolean()
  @ApiProperty({
    description: 'The status of the environment variable',
    default: true,
  })
  status: boolean;
}
