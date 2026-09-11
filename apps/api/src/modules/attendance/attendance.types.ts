import { IEmployeeEntity } from '../employees/employee.types';

export enum AbsenceType {
  SICK_LEAVE = 'CH',
  UNEXCUSED_ABSENCE = 'NN',
  UNPAID_LEAVE = 'UB',
  VACATION_LEAVE = 'UW',
  MATERNITY_LEAVE = 'UM',
  UNPAID_EXCUSED_ABSENCE = 'NUN',
  PAID_EXCUSED_ABSENCE = 'NUP',
  PATERNITY_LEAVE = 'UO',
  CARE = 'OP',
  REHABILITATION_BENEFIT = 'REH',
  PARENTAL_LEAVE = 'UR',
  ON_DEMAND_LEAVE = 'UŻ',
  CIRCUMSTANTIAL_LEAVE = 'UOK',
  DAY_OFF_FOR_HOLIDAY = 'WZS',
  PARENTAL_CHILD_LEAVE = 'WYC',
}

export const AttendanceStatus = {
  ...AbsenceType,
  PRESENCE: 'OB',
} as const satisfies Record<string, string>;

export interface IAbsenceEntity {
  id: string;
  employee: IEmployeeEntity;
  type: AbsenceType;
  date: Date;
}

export type IAddAbsenceDto = Omit<IAbsenceEntity, 'id' | 'employee'> & {
  employee: string;
};
