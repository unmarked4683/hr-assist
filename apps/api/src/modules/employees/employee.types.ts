import { IUserEntity } from '../users/user.types';

export enum Location {
  PRODUCTION = 1,
  OFFICE = 2,
}

export enum ContractType {
  EMPLOYMENT_CONTRACT = 1,
}

// export interface IWorkScheduleEntity {
//   id: string;
//   startTime: string;
//   endTime: string;
// }

// export interface ICompanyEntity {
//   id: string;
//   name: string;
//   nip: string;
//   city: string;
//   number: string;
//   postCity: string;
//   postCode: string;
// }

export interface IEmployeeEntity {
  id: string;
  name: string;
  surname: string;
  pesel: string;
  createdAt: Date;
  updatedAt: Date;
  position: string;
  location: Location;
  // company: ICompanyEntity;
  company: string;
  workHours: number;
  // workSchedule: IWorkScheduleEntity;
  workSchedule: string;
  employmentDate: Date;
  contractType: ContractType;
  firedAt: Date | null;
  firedBy: IUserEntity | null;
}

export type ICreateEmployeeDto = Omit<
  IEmployeeEntity,
  'id' | 'createdAt' | 'updatedAt' | 'firedBy' | 'createdBy' | 'firedAt'
>;
