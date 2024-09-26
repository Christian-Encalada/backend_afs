import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Parish } from './parish.entity';
import { ParishService } from './parish.service';
import { Province } from '@/province/province.entity';
import { Canton } from '@/canton/canton.entity';
import { ParishController } from './parish.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Parish, Province, Canton])],
  providers: [ParishService],
  controllers: [ParishController],
  exports: [ParishService],
})
export class ParishModule {}
