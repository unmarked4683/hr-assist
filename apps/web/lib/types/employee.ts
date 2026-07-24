import type { CreateEmployeeLeaveInput, EmployeeLeave } from "@/lib/types/leave";

export type EmployeeStatus = "OK" | "NN";

export type Location = "Biuro" | "Hala";

export type ContractType = "UoP";

export type FteFraction =
  | "1/8"
  | "2/8"
  | "3/8"
  | "4/8"
  | "5/8"
  | "6/8"
  | "7/8"
  | "8/8";

export interface LegalEntity {
  id: string;
  name: string;
}

export interface EmployeeSummary {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
  location: Location;
  pesel: string;
  status: EmployeeStatus;
}

export interface Employee extends EmployeeSummary {
  birthDate: string;
  department: string;
  legalEntity: LegalEntity;
  contractType: ContractType;
  fte: FteFraction;
  workStart: string;
  workEnd: string;
  leave: EmployeeLeave;
}

export interface CreateEmployeeInput {
  firstName: string;
  lastName: string;
  pesel: string;
  contractType: ContractType;
  fte: FteFraction;
  workStart: string;
  workEnd: string;
  location: Location;
  position: string;
  legalEntityId: string;
  leave: CreateEmployeeLeaveInput;
}
