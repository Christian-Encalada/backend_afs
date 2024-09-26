import { Entity, Column, ManyToOne, Unique } from 'typeorm';
import { Tenant } from '@/tenant/tenant.entity';
import { Person } from '@/person/person.entity';
import { UserRole } from './interface/userRole';
import { Exclude } from 'class-transformer';

@Entity()
@Unique(['tenant', 'username'])
@Unique(['tenant', 'email'])
export class User extends Person {
  @Column({
    nullable: true,
    unique: true,
  })
  username: string;

  @Column({
    nullable: false,
    type: 'enum',
    enum: UserRole,
  })
  role: UserRole;

  @Column()
  @Exclude()
  password: string;

  @Column({
    nullable: true,
    type: 'uuid',
    unique: true,
    name: 'reset_password_token',
  })
  resetPasswordToken: string;

  @Column({
    nullable: false,
    default: true,
    type: 'boolean',
  })
  status: boolean;

  @ManyToOne(() => Tenant, (tenant) => tenant.users)
  tenant: Tenant;
}
