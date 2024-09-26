import { Module } from '@nestjs/common';
import { EmailTemplatesService } from './emailTemplates.service';

@Module({
  providers: [EmailTemplatesService],
  exports: [EmailTemplatesService],
})
export class EmailTemplatesModule {}
