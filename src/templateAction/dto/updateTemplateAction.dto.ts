import { PartialType } from '@nestjs/swagger';
import { CreateTemplateActionDto } from './createTemplateAction.dto';

export class UpdateTemplateActionDto extends PartialType(
  CreateTemplateActionDto,
) {}
