import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Tenant } from '@/tenant/tenant.entity';
import { CountryModule } from '@/country/country.module';
import { Province } from '@/province/province.entity';
import { Canton } from '@/canton/canton.entity';
import { Parish } from '@/parish/parish.entity';
import { I18nContext } from 'nestjs-i18n';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Tenant, Province, Canton, Parish]),
    CountryModule,
    I18nContext,
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
