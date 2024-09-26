import { Tenant } from '@/tenant/tenant.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Template } from '@/site/interface/siteEnum';

@Entity()
@Unique(['name'])
export class Site {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'text', nullable: true })
  primaryColor?: string;

  @Column({ type: 'text', nullable: true })
  secondaryColor?: string;

  @Column({ type: 'enum', nullable: true, enum: Template })
  template?: Template;

  @Column({ type: 'text', nullable: true })
  logo?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: false, default: true })
  status: boolean;

  @ManyToOne(() => Tenant, (tenant) => tenant.id)
  tenant: Tenant;
}
