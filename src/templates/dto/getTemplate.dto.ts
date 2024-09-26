import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { GetTemplateActionDto } from '@/templateAction/dto/getTemplateAction.dto';
import { GetTemplateEnvDto } from '@/templateEnv/dto/getTemplateEnv.dto';

export class GetTemplateDto {
  @ApiProperty({ description: 'The ID of the template' })
  @Expose()
  id: number;

  @ApiProperty({ description: 'The name of the template' })
  @Expose()
  name: string;

  @ApiProperty({ description: 'The content of the template' })
  @Expose()
  content: string;

  @ApiProperty({ description: 'The tenant ID associated with the template' })
  @Expose()
  tenantId: number;

  @ApiProperty({ description: 'The status of the template' })
  @Expose()
  status: boolean;

  @ApiProperty({ description: 'Whether the template is active', default: true })
  @Expose()
  activate: boolean;

  @ApiProperty({ description: 'The action associated with the template' })
  @Expose()
  @Type(() => GetTemplateActionDto)
  action: GetTemplateActionDto;

  @ApiProperty({ description: 'The environments associated with the template' })
  @Expose()
  @Type(() => GetTemplateEnvDto)
  templateEnvs: GetTemplateEnvDto[];

  @Expose()
  @ApiProperty({ description: 'The date of creation of the template' })
  createdAt: Date;

  @Expose()
  @ApiProperty({ description: 'The date of the last update of the template' })
  updateAt: Date;
}
