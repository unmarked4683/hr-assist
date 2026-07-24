import { ProgressBar } from "@/components/ui/progress-bar";
import type { Employee } from "@/lib/types/employee";
import { buildLeaveProgress } from "@/lib/utils/leave";

interface LeaveTabProps {
  employee: Employee;
}

export function LeaveTab({ employee }: LeaveTabProps) {
  const overdue = buildLeaveProgress("Zaległy", employee.leave.overdue);
  const current = buildLeaveProgress("Aktualny", employee.leave.current);

  return (
    <div className="grid h-full min-h-0 w-full grid-cols-1 gap-4 md:grid-cols-2">
      <div className="flex h-full min-h-0 flex-col justify-start space-y-3 overflow-hidden rounded-md border border-slate-200 bg-slate-50/40 p-4">
        <p className="text-sm font-medium">{overdue.displayText}</p>
        <ProgressBar value={overdue.percentage} label={overdue.percentageLabel} />
      </div>
      <div className="flex h-full min-h-0 flex-col justify-start space-y-3 overflow-hidden rounded-md border border-slate-200 bg-slate-50/40 p-4">
        <p className="text-sm font-medium">{current.displayText}</p>
        <ProgressBar value={current.percentage} label={current.percentageLabel} />
      </div>
    </div>
  );
}
