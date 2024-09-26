import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemplateEnv } from './templateEnv.entity';
import { TemplateEnvService } from './templateEnv.service';
import { TemplateEnvController } from './templateEnv.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TemplateEnv])],
  providers: [TemplateEnvService],
  controllers: [TemplateEnvController],
  exports: [TemplateEnvService],
})
export class TemplateEnvModule {}
