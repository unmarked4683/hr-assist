"use client";

import { useRouter } from "next/navigation";

import {
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableHead,
  DataTableHeaderCell,
  DataTableRow,
} from "@/components/ui/data-table";
import { LocationBadge } from "@/components/ui/location-badge";
import { StatusIndicator } from "@/components/ui/status-indicator";
import { StickyTableContainer } from "@/components/ui/sticky-table-container";
import { ROUTES } from "@/lib/constants/navigation";
import type { EmployeeSummary } from "@/lib/types/employee";

interface EmployeeTableProps {
  employees: EmployeeSummary[];
}

export function EmployeeTable({ employees }: EmployeeTableProps) {
  const router = useRouter();

  return (
    <StickyTableContainer className="min-h-0 flex-1">
      <DataTable>
        <DataTableHead>
          <tr>
            <DataTableHeaderCell>Imię</DataTableHeaderCell>
            <DataTableHeaderCell>Nazwisko</DataTableHeaderCell>
            <DataTableHeaderCell>Stanowisko</DataTableHeaderCell>
            <DataTableHeaderCell>Lokalizacja</DataTableHeaderCell>
            <DataTableHeaderCell>Status</DataTableHeaderCell>
          </tr>
        </DataTableHead>
        <DataTableBody>
          {employees.map((employee) => (
            <DataTableRow
              key={employee.id}
              onClick={() => router.push(ROUTES.employeeDetail(employee.id))}
              className={employee.status === "NN" ? "pulse-nn" : undefined}
            >
              <DataTableCell>{employee.firstName}</DataTableCell>
              <DataTableCell>{employee.lastName}</DataTableCell>
              <DataTableCell>{employee.position}</DataTableCell>
              <DataTableCell>
                <LocationBadge location={employee.location} />
              </DataTableCell>
              <DataTableCell>
                <StatusIndicator status={employee.status} />
              </DataTableCell>
            </DataTableRow>
          ))}
        </DataTableBody>
      </DataTable>
    </StickyTableContainer>
  );
}
