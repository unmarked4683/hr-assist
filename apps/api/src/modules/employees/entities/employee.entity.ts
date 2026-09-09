import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ContractType, IEmployeeEntity, Location } from '../employee.types';
import { Max, Min } from 'class-validator';
import { UserEntity } from '../../users/user.entity';
import { CompanyEntity } from 'src/modules/companies/entities/company.entity';
import { WorkScheduleEntity } from './work-schedule.entity';
import { AbsenceEntity } from 'src/modules/attendance/entities/absence.entity';

@Entity('employees')
export class EmployeeEntity extends BaseEntity implements IEmployeeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  surname: string;

  @Column({ type: 'varchar', length: 11, unique: true })
  pesel: string;

  @Column({ type: 'varchar', length: 255 })
  position: string;

  @Column({ type: 'enum', enum: Location })
  location: Location;

  @Min(1)
  @Max(8)
  @Column({ type: 'int' })
  workHours: number;

  @Column(() => WorkScheduleEntity)
  workSchedule: WorkScheduleEntity;

  @Column({ type: 'date' })
  employmentDate: Date;

  @Column({ type: 'enum', enum: ContractType })
  contractType: ContractType;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp with time zone' })
  firedAt: Date | null;

  @ManyToOne(() => UserEntity, { nullable: true })
  @JoinColumn({ name: 'fired_by_id' })
  firedBy: UserEntity | null;

  @OneToMany(() => AbsenceEntity, (absence) => absence.employee)
  absences: AbsenceEntity[];

  @ManyToOne(() => CompanyEntity, (company) => company.employees, {
    eager: true,
  })
  company: CompanyEntity;
}
