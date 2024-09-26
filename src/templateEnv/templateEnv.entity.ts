import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Template } from '@/templates/template.entity';

@Entity()
export class TemplateEnv {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  env: string;

  @Column('text')
  description: string;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @ManyToMany(() => Template, (template) => template.templateEnvs)
  templates: Template[];
}
