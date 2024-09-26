import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Tenant } from '@/tenant/tenant.entity';
import { TemplateAction } from '@/templateAction/templateAction.entity';
import { TemplateEnv } from '@/templateEnv/templateEnv.entity';

@Entity()
export class Template {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text')
  content: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.templates)
  tenant: Tenant;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @Column({ type: 'boolean', default: true })
  activate: boolean;

  @ManyToOne(() => TemplateAction, (action) => action.templates)
  @JoinColumn({ name: 'action_id' })
  action: TemplateAction;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @ManyToMany(() => TemplateEnv, { cascade: true })
  @JoinTable({
    name: 'template_variable_map',
    joinColumn: { name: 'template_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'env_id', referencedColumnName: 'id' },
  })
  templateEnvs: TemplateEnv[];
}
