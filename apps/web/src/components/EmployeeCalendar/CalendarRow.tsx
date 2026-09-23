"use client";

import { forwardRef, useState } from "react";
import { format, isWeekend } from "date-fns";
import { pl } from "date-fns/locale";
import { useParams } from "next/navigation";
import { TableCell, TableRow } from "@/components/ui/table";
import { StatusIndicator } from "./StatusIndicator";
import {
  AttendanceStatus,
  DEFAULT_SCHEDULE,
  NOMINAL_WORK_HOURS,
} from "./types";
import { cn } from "@/lib/utils";
import { AttendanceModal } from "./AttendanceModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiService } from "@/services/api.service";
import { QueryKeysService } from "@/services/query-keys.service";
import { Employee, EmployeesList } from "@/types";

interface CalendarRowProps {
  date: Date;
  rawStatus?: AttendanceStatus;
  isToday: boolean;
  isFuture: boolean;
  rowIndex: number;
  holidaysMap?: Map<string, string>;
}

export const CalendarRow = forwardRef<HTMLTableRowElement, CalendarRowProps>(
  ({ date, rawStatus, isToday, isFuture, holidaysMap = new Map() }, ref) => {
    const params = useParams();
    const employeeId = params?.id as string;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const queryClient = useQueryClient();
    const weekdayLabel = format(date, "EEEE", { locale: pl });
    const weekend = isWeekend(date);

    const formattedDateString = format(date, "yyyy-MM-dd");
    const holidayName = holidaysMap.get(formattedDateString) || null;

    const isDisabled = weekend || isFuture || Boolean(holidayName);

    const effectiveStatus: AttendanceStatus | null = holidayName
      ? null
      : weekend || isFuture
        ? null
        : rawStatus || "OB";

    const isUnexcused = effectiveStatus === "NN";

    const mutation = useMutation({
      mutationFn: async (newStatus: AttendanceStatus) => {
        if (!employeeId) throw new Error("Brak ID pracownika w URL");
        const dateString: string = format(date, "yyyy-MM-dd");
        await ApiService.updateEmployeeAttendance(employeeId, {
          status: newStatus,
          date: dateString,
        });
      },
      onSuccess: async (_, newStatus) => {
        const year = parseInt(format(date, "yyyy"), 10);
        const month = parseInt(format(date, "M"), 10);

        // 1. Inwalidujemy i od razu pobieramy świeże absencje dla tego miesiąca
        await queryClient.invalidateQueries({
          queryKey: QueryKeysService.attendancePerMonth({
            employeeId,
            year,
            month,
          }),
        });

        // 2. Natychmiast odświeżamy szczegóły tego pracownika (w tym flagę 'ok') za pomocą refetch
        await queryClient.refetchQueries({
          queryKey: QueryKeysService.employeeDetails({ employeeId }),
        });

        // 3. Bezpośrednio modyfikujemy cache listy pracowników, żeby flaga/status zmieniły się w locie
        queryClient.setQueryData(
          QueryKeysService.employeesList(),
          (oldData: EmployeesList | undefined) => {
            if (!oldData) return oldData;

            // Zakładając, że EmployeesList to tablica pracowników lub obiekt zawierający tablicę
            const list = Array.isArray(oldData)
              ? oldData
              : (oldData as EmployeesList);
            if (!Array.isArray(list)) return oldData;

            const updatedList = list.map(({}: Employee) => {
              if (emp.id === employeeId) {
                // Jeśli zmieniono na NN, ustawiamy ok na false, w przeciwnym razie backend zweryfikuje przy refetchu
                return {
                  ...emp,
                  ok: newStatus === "NN" ? false : emp.ok,
                };
              }
              return emp;
            });

            return Array.isArray(oldData)
              ? updatedList
              : { ...oldData, employees: updatedList };
          },
        );

        setIsModalOpen(false);
      },
      onError: (error) => {
        console.error("Błąd podczas aktualizacji frekwencji:", error);
      },
    });

    const handleRowClick = () => {
      if (isDisabled) return;
      setIsModalOpen(true);
    };

    const handleUpdateStatus = (newStatus: AttendanceStatus) => {
      mutation.mutate(newStatus);
    };

    return (
      <>
        <TableRow
          ref={ref}
          onClick={handleRowClick}
          className={cn(
            "transition-colors",
            isDisabled
              ? "opacity-60 cursor-not-allowed bg-muted/20"
              : "cursor-pointer hover:bg-muted/40",
            isToday && "bg-muted/50 font-medium",
            isUnexcused && "bg-destructive/15 animate-pulse",
          )}
        >
          <TableCell className="font-medium">
            {format(date, "d MMMM yyyy", { locale: pl })}
          </TableCell>
          <TableCell className="capitalize text-muted-foreground">
            {weekdayLabel}
          </TableCell>
          <TableCell>
            {holidayName ? (
              <span
                title="Święto ustawowo wolne"
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 cursor-help"
              >
                ŚUW
              </span>
            ) : (
              <div
                className={cn(
                  isUnexcused && "inline-block animate-pulse duration-1000",
                )}
              >
                <StatusIndicator status={effectiveStatus} />
              </div>
            )}
          </TableCell>

          {holidayName ? (
            <TableCell
              colSpan={3}
              className="text-center font-medium text-muted-foreground bg-muted/10 italic"
            >
              {holidayName}
            </TableCell>
          ) : (
            <>
              <TableCell className="text-muted-foreground">
                {isDisabled
                  ? "—"
                  : `${DEFAULT_SCHEDULE.start} - ${DEFAULT_SCHEDULE.end}`}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {isDisabled ? "—" : `${NOMINAL_WORK_HOURS}h`}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {isDisabled
                  ? "—"
                  : isUnexcused
                    ? "0h"
                    : `${NOMINAL_WORK_HOURS}h`}
              </TableCell>
            </>
          )}
        </TableRow>

        {!isDisabled && (
          <AttendanceModal
            isOpen={isModalOpen}
            onClose={() => {
              if (!mutation.isPending) setIsModalOpen(false);
            }}
            date={date}
            currentStatus={effectiveStatus}
            onUpdate={handleUpdateStatus}
          />
        )}
      </>
    );
  },
);

CalendarRow.displayName = "CalendarRow";
