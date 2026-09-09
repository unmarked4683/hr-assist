import { IAbsenceEntity } from '../attendance/attendance.types';
import { ICompanyEntity } from '../companies/company.types';
import { IUserEntity } from '../users/user.types';

export enum Location {
  PRODUCTION = 1,
  OFFICE = 2,
}

export enum ContractType {
  EMPLOYMENT_CONTRACT = 1,
}

export interface IWorkScheduleEntity {
  start: string;
  end: string;
}

export type IWorkScheduleDto = IWorkScheduleEntity;

export interface IEmployeeEntity {
  id: string;
  name: string;
  surname: string;
  pesel: string;
  createdAt: Date;
  updatedAt: Date;
  position: string;
  location: Location;
  company: ICompanyEntity;
  workHours: number;
  workSchedule: IWorkScheduleEntity;
  employmentDate: Date;
  contractType: ContractType;
  firedAt: Date | null;
  firedBy: IUserEntity | null;
  absences: IAbsenceEntity[];
}

export type ICreateEmployeeDto = Omit<
  IEmployeeEntity,
  | 'id'
  | 'createdAt'
  | 'updatedAt'
  | 'firedBy'
  | 'createdBy'
  | 'firedAt'
  | 'company'
> & {
  company: string;
};
