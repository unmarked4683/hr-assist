import { EmployeeHybridActions } from "@/components/employees/employee-hybrid-actions";
import type { Employee } from "@/lib/types/employee";
import { cn } from "@/lib/utils";

interface EmployeeProfileHeaderProps {
  employee: Employee;
  className?: string;
}

export function EmployeeProfileHeader({
  employee,
  className,
}: EmployeeProfileHeaderProps) {
  const fullName = `${employee.firstName} ${employee.lastName}`.toUpperCase();

  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      <h1 className="text-2xl font-bold tracking-wide text-slate-900">{fullName}</h1>
      <EmployeeHybridActions />
    </div>
  );
}
