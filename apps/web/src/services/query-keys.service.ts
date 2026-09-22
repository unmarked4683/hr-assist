export class QueryKeysService {
  private static readonly ATTENDANCE_SCOPE = "attendance" as const;
  private static readonly EMPLOYEE_SCOPE = "employee" as const;

  public static attendancePerMonth(params: {
    employeeId: string;
    year: number;
    month: number;
  }) {
    return [
      this.ATTENDANCE_SCOPE,
      params.employeeId,
      "month",
      params.year,
      params.month,
    ] as const;
  }

  public static employeeDetails(params: { employeeId: string }) {
    return [this.EMPLOYEE_SCOPE, params.employeeId] as const;
  }
}
