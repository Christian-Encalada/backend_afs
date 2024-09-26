import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class GetTemplateEnvDto {
  @ApiProperty({ description: 'The ID of the environment variable' })
  @Expose()
  id: number;

  @ApiProperty({ description: 'The name of the environment variable' })
  @Expose()
  env: string;

  @ApiProperty({ description: 'The description of the environment variable' })
  @Expose()
  description: string;

  @ApiProperty({
    description: 'The status of the environment variable',
    default: true,
  })
  @Expose()
  status: boolean;
}
