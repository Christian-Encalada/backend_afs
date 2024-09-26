import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';
import { User } from '@/user/user.entity';
import { Tenant } from '@/tenant/tenant.entity';
import { Client } from '@/client/client.entity';

@Entity()
export class Quote {
  @PrimaryGeneratedColumn()
  id: number;

  // Automatically TypeORM manage the createdAt and updatedAt columns
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @ManyToOne(() => Tenant, (tenant) => tenant.id)
  tenant: Tenant;

  @ManyToOne(() => Client, (client) => client.id)
  client: Client;
}
