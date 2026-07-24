export type LeavePool = 20 | 26;

export interface LeaveBalance {
  used: number;
  pool: number | null;
}

export interface EmployeeLeave {
  overdue: LeaveBalance;
  current: LeaveBalance;
}

export interface CreateEmployeeLeaveInput {
  overdueUsed: number;
  pool: LeavePool;
}

export interface LeaveProgress {
  label: string;
  displayText: string;
  percentage: number;
  percentageLabel: string;
}
