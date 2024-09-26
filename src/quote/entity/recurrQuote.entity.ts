import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import {
  Frequency,
  DaysOfWeek,
  MonthsOfYear,
} from '@/quote/interface/recurrQuoteEnums';
import { Quote } from '@/quote/entity/quote.entity';

@Entity()
export class RecurrenceQuote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: Frequency,
  })
  frequency: Frequency;

  @Column()
  interval: number;

  @Column({
    nullable: true,
    type: 'enum',
    enum: DaysOfWeek,
    array: true,
  })
  daysOfWeek?: DaysOfWeek[];

  @Column({ nullable: true })
  dayOfMonth?: number;

  @Column({
    nullable: true,
    type: 'enum',
    enum: MonthsOfYear,
    array: true,
  })
  monthsOfYear?: MonthsOfYear[];

  @UpdateDateColumn({ nullable: true })
  endDateRecurr?: Date;

  @Column({ nullable: true })
  occurrences?: number;

  @OneToOne(() => Quote, (quote) => quote.id)
  @JoinColumn()
  quote: Quote;
}
