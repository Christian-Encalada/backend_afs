import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemplateDefault } from './templateDefault.entity';
import { TemplateDefaultService } from './templateDefault.service';
import { TemplateDefaultController } from './templateDefault.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TemplateDefault])],
  providers: [TemplateDefaultService],
  controllers: [TemplateDefaultController],
  exports: [TemplateDefaultService],
})
export class TemplateDefaultModule {}
