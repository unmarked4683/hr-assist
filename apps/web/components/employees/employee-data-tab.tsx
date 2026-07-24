import {
  Briefcase,
  Building2,
  Clock,
  FileText,
  Fingerprint,
  MapPin,
  PieChart,
  User,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { Employee, FteFraction } from "@/lib/types/employee";
import { formatBirthDate, parseIsoDate } from "@/lib/utils/date";

interface EmployeeDataTabProps {
  employee: Employee;
}

interface DataFieldProps {
  icon: LucideIcon;
  label: string;
  value: string;
}

function DataField({ icon: Icon, label, value }: DataFieldProps) {
  return (
    <div className="flex w-full items-center justify-center">
      <div className="flex w-full max-w-[210px] items-center gap-3">
        <Icon
          className="h-5 w-5 shrink-0 text-slate-400"
          strokeWidth={1.75}
          aria-hidden="true"
        />
        <div className="flex flex-col justify-center gap-0">
          <span className="text-xs font-medium text-slate-500">{label}</span>
          <span className="line-clamp-1 text-sm font-semibold text-slate-900">
            {value}
          </span>
        </div>
      </div>
    </div>
  );
}

function formatFteCompact(fte: FteFraction): string {
  const fullTimeLabel = fte === "8/8" ? "Pełen etat" : "Część etatu";
  return `${fullTimeLabel} (${fte})`;
}

export function EmployeeDataTab({ employee }: EmployeeDataTabProps) {
  const birthDate = formatBirthDate(parseIsoDate(employee.birthDate));

  return (
    <div className="w-full rounded-t-none rounded-b-lg bg-white">
      <div className="grid w-full grid-cols-4 gap-x-4 gap-y-4 px-6 py-4">
        <DataField icon={Fingerprint} label="PESEL" value={employee.pesel} />
        <DataField icon={User} label="Data urodzenia" value={birthDate} />
        <DataField icon={Briefcase} label="Stanowisko" value={employee.position} />
        <DataField
          icon={Building2}
          label="Firma / Dział"
          value={employee.legalEntity.name}
        />
        <DataField icon={MapPin} label="Lokalizacja" value={employee.location} />
        <DataField
          icon={PieChart}
          label="Wymiar etatu"
          value={formatFteCompact(employee.fte)}
        />
        <DataField
          icon={Clock}
          label="Godziny pracy"
          value={`${employee.workStart} - ${employee.workEnd}`}
        />
        <DataField
          icon={FileText}
          label="Typ umowy"
          value={employee.contractType}
        />
      </div>
    </div>
  );
}
