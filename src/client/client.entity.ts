// src/client/client.entity.ts
import { Entity, ManyToOne, Unique } from 'typeorm';
import { Tenant } from '@/tenant/tenant.entity';
import { Person } from '@/person/person.entity';

@Entity()
@Unique(['tenant', 'document'])
@Unique(['tenant', 'email'])
export class Client extends Person {
  @ManyToOne(() => Tenant, (tenant) => tenant.clients)
  tenant: Tenant;
}
