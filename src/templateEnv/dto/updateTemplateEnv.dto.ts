import { PartialType } from '@nestjs/swagger';
import { CreateTemplateEnvDto } from './createTemplateEnv.dto';

export class UpdateTemplateEnvDto extends PartialType(CreateTemplateEnvDto) {}
