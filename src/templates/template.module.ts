import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Template } from './template.entity';
import { TemplateDefault } from '../templateDefault/templateDefault.entity';
import { TemplateService } from './template.service';
import { TemplateController } from './template.controller';
import { TemplateAction } from '../templateAction/templateAction.entity';
import { TemplateEnv } from '../templateEnv/templateEnv.entity';
import { Tenant } from '../tenant/tenant.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Template,
      TemplateDefault,
      TemplateAction,
      TemplateEnv,
      Tenant,
    ]),
  ],
  providers: [TemplateService],
  controllers: [TemplateController],
  exports: [TemplateService],
})
export class TemplateModule {}
