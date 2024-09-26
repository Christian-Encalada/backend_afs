import { Module } from '@nestjs/common';
import { UploadService } from '@/upload/upload.service';
import { UploadController } from '@/upload/upload.controller';
import { UploadSiteService } from '@/upload//uploadSite.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Site } from '@/site/site.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Site])],
  providers: [UploadService, UploadSiteService],
  controllers: [UploadController],
  exports: [UploadService, UploadSiteService],
})
export class UploadModule {}
