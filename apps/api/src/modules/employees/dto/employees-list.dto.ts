import { IAbsenceEntity } from 'src/modules/attendance/attendance.types';
import { ICompanyEntity } from 'src/modules/companies/company.types';
import { IUserEntity } from 'src/modules/users/user.types';
import {
  ContractType,
  IEmployeeResponseDto,
  ILeaveEntity,
  IWorkScheduleEntity,
  Location,
} from '../employee.types';

export class EmployeeResponseDto implements IEmployeeResponseDto {
  ok: boolean;
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
  leave: ILeaveEntity;
}
