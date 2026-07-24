import { LEGAL_ENTITIES } from "@/lib/constants/employee-form";
import type { AttendanceCode, MonthCalendarData } from "@/lib/types/attendance";
import type {
  CreateEmployeeInput,
  Employee,
  EmployeeSummary,
} from "@/lib/types/employee";
import { getDaysInMonth, toIsoDate } from "@/lib/utils/date";
import { extractBirthDateFromPesel } from "@/lib/utils/pesel";
import { resolveMonthLockState } from "@/lib/utils/month-lock";
import { buildCalendarDay } from "@/services/mock-calendar";

const attendanceOverrides = new Map<string, AttendanceCode>();
const manualLocks = new Set<string>();

let employees: Employee[] = [
  {
    id: "emp-1",
    firstName: "Jan",
    lastName: "Kowalski",
    position: "Magazynier",
    location: "Hala",
    pesel: "85071812349",
    status: "NN",
    birthDate: "1985-07-18",
    department: "Dział Konstrukcji",
    legalEntity: LEGAL_ENTITIES[0],
    contractType: "UoP",
    fte: "8/8",
    workStart: "08:00",
    workEnd: "16:00",
    leave: {
      overdue: { used: 10, pool: 20 },
      current: { used: 0, pool: 26 },
    },
  },
  {
    id: "emp-2",
    firstName: "Maria",
    lastName: "Nowak",
    position: "Specjalista HR",
    location: "Biuro",
    pesel: "92031545672",
    status: "OK",
    birthDate: "1992-03-15",
    department: "Dział Administracji",
    legalEntity: LEGAL_ENTITIES[2],
    contractType: "UoP",
    fte: "8/8",
    workStart: "09:00",
    workEnd: "17:00",
    leave: {
      overdue: { used: 4, pool: 20 },
      current: { used: 2, pool: 26 },
    },
  },
];

export function getMockEmployees(): EmployeeSummary[] {
  return employees.map(
    ({ id, firstName, lastName, position, location, pesel, status }) => ({
      id,
      firstName,
      lastName,
      position,
      location,
      pesel,
      status,
    }),
  );
}

export function getMockEmployeeById(id: string): Employee | undefined {
  return employees.find((employee) => employee.id === id);
}

export function createMockEmployee(input: CreateEmployeeInput): Employee {
  const birthDate = extractBirthDateFromPesel(input.pesel);
  const legalEntity =
    LEGAL_ENTITIES.find((entity) => entity.id === input.legalEntityId) ??
    LEGAL_ENTITIES[0];

  const employee: Employee = {
    id: `emp-${Date.now()}`,
    firstName: input.firstName,
    lastName: input.lastName,
    position: input.position,
    location: input.location,
    pesel: input.pesel,
    status: "OK",
    birthDate: birthDate ? toIsoDate(birthDate) : "1900-01-01",
    department: legalEntity.name,
    legalEntity,
    contractType: input.contractType,
    fte: input.fte,
    workStart: input.workStart,
    workEnd: input.workEnd,
    leave: {
      overdue: { used: input.leave.overdueUsed, pool: input.leave.pool },
      current: { used: 0, pool: input.leave.pool },
    },
  };

  employees = [employee, ...employees];
  return employee;
}

export function getMockMonthCalendar(
  employeeId: string,
  year: number,
  month: number,
): MonthCalendarData {
  const employee = getMockEmployeeById(employeeId);
  if (!employee) {
    throw new Error("Nie znaleziono pracownika");
  }

  const lockInfo = resolveMonthLockState(year, month, new Date(), manualLocks);
  const daysInMonth = getDaysInMonth(year, month);
  const days = Array.from({ length: daysInMonth }, (_, index) =>
    buildCalendarDay(
      employee,
      year,
      month,
      index + 1,
      lockInfo.isLocked,
      attendanceOverrides,
    ),
  );

  return {
    employeeId,
    year,
    month,
    lockState: lockInfo.state,
    isLocked: lockInfo.isLocked,
    days,
  };
}

export function setMockAttendance(
  employeeId: string,
  date: string,
  code: AttendanceCode,
): void {
  attendanceOverrides.set(`${employeeId}:${date}`, code);
}

export function removeMockAttendance(employeeId: string, date: string): void {
  attendanceOverrides.delete(`${employeeId}:${date}`);
}

export function lockMockMonth(
  _employeeId: string,
  year: number,
  month: number,
): void {
  manualLocks.add(`${year}-${month}`);
}
