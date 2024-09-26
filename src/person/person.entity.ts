import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { Country } from '@/country/country.entity';
import { Province } from '@/province/province.entity';
import { Canton } from '@/canton/canton.entity';
import { Parish } from '@/parish/parish.entity';

@Entity()
export class Person {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
    length: 100,
  })
  name: string;

  @Column({
    nullable: true,
    length: 100,
  })
  lastName: string;

  @Column({
    nullable: true,
    length: 100,
  })
  email: string;

  @Column({ nullable: true })
  document: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  direction: string;

  @ManyToOne(() => Country, { nullable: true })
  country: Country;

  @ManyToOne(() => Province, { nullable: true })
  province: Province;

  @ManyToOne(() => Canton, { nullable: true })
  canton: Canton;

  @ManyToOne(() => Parish, { nullable: true })
  parish: Parish;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @Column({ default: false })
  deleted: boolean;
}
