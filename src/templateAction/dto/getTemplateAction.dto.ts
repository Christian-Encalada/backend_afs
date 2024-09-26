import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class GetTemplateActionDto {
  @ApiProperty({ description: 'The ID of the template action' })
  @Expose()
  id: number;

  @ApiProperty({ description: 'The name of the template action' })
  @Expose()
  name: string;

  @ApiProperty({ description: 'The description of the template action' })
  @Expose()
  description: string;

  @ApiProperty({
    description: 'The status of the template action',
    default: true,
  })
  @Expose()
  status: boolean;
}
