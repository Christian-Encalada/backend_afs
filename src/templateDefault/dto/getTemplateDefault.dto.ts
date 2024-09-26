import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class GetTemplateDefaultDto {
  @ApiProperty({ description: 'The ID of the default template' })
  @Expose()
  id: number;

  @ApiProperty({ description: 'The name of the default template' })
  @Expose()
  name: string;

  @ApiProperty({ description: 'The content of the default template' })
  @Expose()
  content: string;

  @ApiProperty({ description: 'The status of the default template' })
  @Expose()
  status: string;
}
