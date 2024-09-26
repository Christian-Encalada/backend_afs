import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './client.entity';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { Tenant } from '@/tenant/tenant.entity';
import { CountryModule } from '@/country/country.module'; // Importar el módulo aquí
import { Province } from '@/province/province.entity';
import { Canton } from '@/canton/canton.entity';
import { Parish } from '@/parish/parish.entity';
import { I18nContext } from 'nestjs-i18n';

@Module({
  imports: [
    TypeOrmModule.forFeature([Client, Tenant, Province, Canton, Parish]),
    CountryModule,
    I18nContext,
  ],
  providers: [ClientService],
  controllers: [ClientController],
})
export class ClientModule {}
