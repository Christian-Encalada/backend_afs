// src/parish/parish.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Province } from '@/province/province.entity';
import { Canton } from '@/canton/canton.entity';

@Entity()
export class Parish {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'text' })
  name: string;

  @ManyToOne(() => Province, { nullable: false })
  province: Province;

  @ManyToOne(() => Canton, { nullable: false })
  canton: Canton;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updateAt: Date;
}
