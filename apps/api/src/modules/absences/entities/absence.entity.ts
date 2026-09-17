import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AbsenceType, IAbsenceEntity } from '../absences.types';
import { EmployeeEntity } from 'src/modules/employees/entities/employee.entity';

@Entity('absences')
export class AbsenceEntity extends BaseEntity implements IAbsenceEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: AbsenceType })
  type: AbsenceType;

  @Column({ type: 'date' })
  date: Date;

  @ManyToOne(() => EmployeeEntity, (employee) => employee.absences)
  @JoinColumn({ name: 'employee_id' })
  employee: EmployeeEntity;
}
