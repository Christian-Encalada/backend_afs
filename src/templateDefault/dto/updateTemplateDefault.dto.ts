import { PartialType } from '@nestjs/swagger';
import { CreateTemplateDefaultDto } from './createTemplateDefault.dto';

export class UpdateTemplateDefaultDto extends PartialType(
  CreateTemplateDefaultDto,
) {}
