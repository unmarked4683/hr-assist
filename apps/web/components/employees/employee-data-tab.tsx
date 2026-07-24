import { IconActionBar } from "@/components/ui/icon-action-bar";
import type { Employee } from "@/lib/types/employee";
import { formatBirthDate, parseIsoDate } from "@/lib/utils/date";
import { formatFteLabel } from "@/lib/utils/working-hours";

interface EmployeeDataTabProps {
  employee: Employee;
}

export function EmployeeDataTab({ employee }: EmployeeDataTabProps) {
  const fullName = `${employee.firstName} ${employee.lastName}`.toUpperCase();
  const birthDate = formatBirthDate(parseIsoDate(employee.birthDate));

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xl font-semibold tracking-wide">{fullName}</p>
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
        <IconActionBar />
      </div>
    </div>
  );
}
