import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemplateAction } from './templateAction.entity';
import { TemplateActionService } from './templateAction.service';
import { TemplateActionController } from './templateAction.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TemplateAction])],
  providers: [TemplateActionService],
  controllers: [TemplateActionController],
  exports: [TemplateActionService],
})
export class TemplateActionModule {}
