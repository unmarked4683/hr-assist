"use client";

import { useQuery } from "@tanstack/react-query";
import { ApiService } from "@/services/api.service";
import { MapPin } from "lucide-react";
import { Employee } from "@/types";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import {
  COLUMNS,
  enrichEmployees,
  createEmployeeFuse,
  performSearch,
} from "@/utils/employees.utils";
import ms from "ms";

export default function List() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const {
    data: employees = [],
    isLoading,
    isError,
  } = useQuery<Employee[]>({
    queryKey: ["employees"],
    queryFn: async () => await ApiService.getEmployees(),
    staleTime: ms("5 minutes"),
    gcTime: ms("1 hour"),
    retry: 1,
  });

  const enrichedEmployees = useMemo(
    () => enrichEmployees(employees),
    [employees],
  );

  const fuse = useMemo(
    () => createEmployeeFuse(enrichedEmployees),
    [enrichedEmployees],
  );

  const filteredEmployees = useMemo(
    () => performSearch(fuse, searchQuery, enrichedEmployees),
    [searchQuery, fuse, enrichedEmployees],
  );

  if (isLoading && employees.length === 0) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Ładowanie pracowników...
      </div>
    );
  }

  if (isError && employees.length === 0) {
    return (
      <div className="p-6 text-center text-destructive">
        Nie udało się pobrać listy pracowników.
      </div>
    );
  }

  return (
    <div className="min-h-0 flex-1 overflow-hidden px-6 py-5">
      <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <table className="w-full shrink-0 table-fixed text-sm">
          <colgroup>
            <col className="w-[16%]" />
            <col className="w-[16%]" />
            <col className="w-[28%]" />
            <col className="w-[20%]" />
            <col className="w-[20%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-border bg-muted/50">
              {COLUMNS.map((label) => (
                <th
                  key={label}
                  className="px-3 py-3 text-center text-xs font-semibold tracking-wide text-muted-foreground uppercase"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
        </table>

        <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
          <table className="w-full table-fixed text-sm">
            <colgroup>
              <col className="w-[16%]" />
              <col className="w-[16%]" />
              <col className="w-[28%]" />
              <col className="w-[20%]" />
              <col className="w-[20%]" />
            </colgroup>
            <tbody>
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-12 text-center text-sm text-muted-foreground"
                  >
                    Brak pracowników spełniających kryteria wyszukiwania.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((employee, index) => (
                  <tr
                    key={employee.id}
                    className={`border-b border-border ${
                      index % 2 === 1 ? "bg-table-row-alt" : ""
                    }`}
                  >
                    <td className="px-3 py-2.5 text-center font-medium text-foreground">
                      {employee.name}
                    </td>
                    <td className="px-3 py-2.5 text-center text-foreground">
                      {employee.surname}
                    </td>
                    <td className="px-3 py-2.5 text-center text-muted-foreground">
                      {employee.position}
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <span className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                        <MapPin size={10} />
                        {employee.locationName}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      {employee.status === "alert" ? (
                        <span className="inline-flex items-center rounded-full border border-destructive/30 bg-destructive/10 px-2.5 py-0.5 text-xs font-semibold text-destructive">
                          Do uzupełnienia
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full border border-border bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                          OK
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
