import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Canton } from './canton.entity';
import { CantonService } from './canton.service';
import { Province } from '@/province/province.entity';
import { CantonController } from './canton.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Canton, Province])],
  providers: [CantonService],
  controllers: [CantonController],
  exports: [CantonService],
})
export class CantonModule {}
