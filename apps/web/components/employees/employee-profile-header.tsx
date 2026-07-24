import { IconActionBar } from "@/components/ui/icon-action-bar";
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
      <p className="flex h-8 items-center text-sm font-semibold tracking-wide">
        {fullName}
      </p>
      <IconActionBar />
    </div>
  );
}
