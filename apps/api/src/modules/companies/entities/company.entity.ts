import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ICompanyEntity } from '../company.types';
import { AddressEntity } from './address.entity';

@Entity('companies')
export class CompanyEntity extends BaseEntity implements ICompanyEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 10, unique: true })
  nip: string;

  @OneToOne(() => AddressEntity, (address) => address.company, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  address: AddressEntity;
}
