import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { User } from '@/user/user.entity';
import { Client } from '@/client/client.entity';
import { Template } from '@/templates/template.entity';

@Entity()
export class Tenant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => User, (user) => user.tenant)
  users: User[];

  @OneToMany(() => Client, (client) => client.tenant)
  clients: Client[];

  @OneToMany(() => Template, (template) => template.tenant)
  templates: Template[];
}
