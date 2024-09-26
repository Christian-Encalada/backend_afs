import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from '@/tenant/tenant.entity';
import { SiteService } from './site.service';
import { Site } from './site.entity';
import { SiteController } from './site.controller';
import { UploadModule } from '@/upload/upload.module';

@Module({
  imports: [UploadModule, TypeOrmModule.forFeature([Site, Tenant])],
  providers: [SiteService],
  controllers: [SiteController],
  exports: [SiteService],
})
export class SiteModule {}
