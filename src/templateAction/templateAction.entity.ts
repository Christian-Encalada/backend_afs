import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Template } from '@/templates/template.entity';

@Entity()
export class TemplateAction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @OneToMany(() => Template, (template) => template.action)
  templates: Template[];
}
