import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TemplateDefault {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text')
  content: string;

  @Column()
  status: string;

  @Column()
  activate: boolean;
}
