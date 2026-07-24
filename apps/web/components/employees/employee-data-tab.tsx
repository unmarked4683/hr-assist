import type { Employee } from "@/lib/types/employee";
import { formatBirthDate, parseIsoDate } from "@/lib/utils/date";
import { formatFteLabel } from "@/lib/utils/working-hours";

interface EmployeeDataTabProps {
  employee: Employee;
}

export function EmployeeDataTab({ employee }: EmployeeDataTabProps) {
  const birthDate = formatBirthDate(parseIsoDate(employee.birthDate));

  return (
    <div className="flex h-full w-full flex-col justify-start space-y-2 rounded-md border p-4">
      <p className="text-sm text-muted-foreground">
        PESEL: {employee.pesel} ({birthDate})
      </p>
      <p className="text-sm">
        {employee.position} • {employee.location} • {employee.legalEntity.name}
      </p>
      <p className="text-sm">
        {employee.workStart} - {employee.workEnd} • {formatFteLabel(employee.fte)} •{" "}
        {employee.contractType}
      </p>
    </div>
  );
}
