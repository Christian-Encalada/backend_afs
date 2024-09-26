import { IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTemplateInitDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'The tenant ID for initializing templates' })
  tenantId: number;
}
