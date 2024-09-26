import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from './tenant.entity';
import { TenantGetDto } from './dto/tenantGet.dto';

@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
  ) {}

  async findOneByName(name: string): Promise<TenantGetDto> {
    return this.tenantRepository.findOne({ where: { name } });
  }
}
