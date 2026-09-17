"use client";

import { useQuery } from "@tanstack/react-query";
import { ApiService } from "@/services/api.service";
import { MapPin, Users, AlertCircle, Loader2 } from "lucide-react";
import { Employee } from "@/types";
import { useSearchParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import {
  COLUMNS,
  enrichEmployees,
  createEmployeeFuse,
  performSearch,
} from "@/utils/employees.utils";
import ms from "ms";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";

export default function List() {
  const router = useRouter();
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
      <div className="min-h-0 flex-1 px-6 py-5">
        <Card className="flex h-full flex-col items-center justify-center p-12 text-center shadow-sm">
          <CardContent className="flex flex-col items-center justify-center p-0">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
            <p className="text-sm font-medium text-muted-foreground">
              Ładowanie listy pracowników...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError && employees.length === 0) {
    return (
      <div className="min-h-0 flex-1 px-6 py-5">
        <Card className="flex h-full flex-col items-center justify-center border-destructive/35 bg-destructive/5 p-12 text-center shadow-sm">
          <CardContent className="flex flex-col items-center justify-center p-0">
            <AlertCircle className="h-8 w-8 text-destructive mb-3" />
            <p className="text-sm font-semibold text-destructive">
              Nie udało się pobrać listy pracowników.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Sprawdź połączenie z serwerem i spróbuj ponownie.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-0 flex-1 overflow-hidden px-6 py-5">
      <Card className="flex h-full flex-col overflow-hidden shadow-sm border border-border">
        <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
          <Table className="w-full table-fixed border-collapse">
            <colgroup>
              <col className="w-[16%]" />
              <col className="w-[16%]" />
              <col className="w-[28%]" />
              <col className="w-[20%]" />
              <col className="w-[20%]" />
            </colgroup>
            <TableHeader className="sticky top-0 z-10 bg-muted/90 backdrop-blur-md">
              {/* Dodano klasy anulujące hover i wprowadzające grubszą, wyraźną linię dolną */}
              <TableRow className="hover:bg-transparent border-b-2 border-border/80">
                {COLUMNS.map((label) => (
                  <TableHead
                    key={label}
                    className="h-auto px-3 py-3.5 text-center text-xs font-bold tracking-wide text-foreground uppercase"
                  >
                    {label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-48 text-center">
                    <div className="flex flex-col items-center justify-center py-6">
                      <Users className="h-8 w-8 text-muted-foreground/50 mb-2" />
                      <p className="text-sm font-medium text-foreground">
                        Brak wyników
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Brak pracowników spełniających kryteria wyszukiwania.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredEmployees.map((employee, index) => (
                  <TableRow
                    key={employee.id}
                    onClick={() => router.push(`/employees/${employee.id}`)}
                    className={`cursor-pointer transition-colors hover:bg-muted/60 border-b border-border/50 ${
                      index % 2 === 1 ? "bg-table-row-alt" : ""
                    }`}
                  >
                    <TableCell className="px-3 py-2.5 text-center font-medium whitespace-normal text-foreground">
                      {employee.name}
                    </TableCell>
                    <TableCell className="px-3 py-2.5 text-center whitespace-normal text-foreground">
                      {employee.surname}
                    </TableCell>
                    <TableCell className="px-3 py-2.5 text-center whitespace-normal text-muted-foreground">
                      {employee.position}
                    </TableCell>
                    <TableCell className="px-3 py-2.5 text-center">
                      <span className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                        <MapPin size={10} />
                        {employee.locationName}
                      </span>
                    </TableCell>
                    <TableCell className="px-3 py-2.5 text-center">
                      {employee.status === "alert" ? (
                        <span className="inline-flex items-center rounded-full border border-destructive/35 bg-destructive/10 px-2.5 py-0.5 text-xs font-semibold text-destructive">
                          Do uzupełnienia
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full border border-border bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                          OK
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
