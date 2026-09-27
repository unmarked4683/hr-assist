"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Employee } from "@/types";

export const EMPLOYEE_INFO_ITEMS_PER_PAGE = 6;

const NO_DATA = "Brak danych";

type CompanyAddress = Employee["company"]["address"];

// Relacje firmy/adresu mogą nie przyjść z API (np. niepełna odpowiedź po zapisie) —
// typy generowane zakładają ich obecność, więc zabezpieczamy się przy renderze.
const formatCompanyAddress = (address: CompanyAddress | undefined): string => {
  if (!address) return NO_DATA;

  const streetLine = [address.street, address.houseNumber]
    .filter(Boolean)
    .join(" ");
  const line = [streetLine, address.city].filter(Boolean).join(", ");
  return line || NO_DATA;
};

interface EmployeeInfoTabProps {
  employee: Employee;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function EmployeeInfoTab({
  employee,
  currentPage,
  onPageChange,
}: EmployeeInfoTabProps) {
  const detailsList = [
    { label: "PESEL", value: employee.pesel },
    { label: "Stanowisko", value: employee.position },
    { label: "Data zatrudnienia", value: employee.employmentDate },
    {
      label: "Godziny pracy",
      value: `${employee.workSchedule.start.slice(0, 5)} - ${employee.workSchedule.end.slice(0, 5)} (${employee.workHours}h)`,
    },
    { label: "Firma", value: employee.company?.name || NO_DATA },
    {
      label: "Typ umowy",
      value: employee.contractType === 1 ? "Umowa o pracę" : "Inna",
    },
    { label: "NIP", value: employee.company?.nip || NO_DATA },
    {
      label: "Adres firmy",
      value: formatCompanyAddress(employee.company?.address),
    },
  ];

  const totalPages = Math.ceil(detailsList.length / EMPLOYEE_INFO_ITEMS_PER_PAGE);
  const currentItems = detailsList.slice(
    currentPage * EMPLOYEE_INFO_ITEMS_PER_PAGE,
    (currentPage + 1) * EMPLOYEE_INFO_ITEMS_PER_PAGE,
  );

  const paddedItems = [
    ...currentItems,
    ...Array.from(
      { length: EMPLOYEE_INFO_ITEMS_PER_PAGE - currentItems.length },
      () => null,
    ),
  ];

  return (
    <TabsContent value="dane" className="flex items-center gap-4">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(Math.max(currentPage - 1, 0))}
        disabled={currentPage === 0}
        className="shrink-0 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="grid flex-1 shrink-0 grid-cols-2 gap-3">
        {paddedItems.map((item, idx) => (
          <div key={idx}>
            {item ? (
              <Card className="flex flex-col space-y-1 bg-muted/40 p-3.5">
                <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                  {item.label}
                </span>
                <span className="truncate text-sm font-semibold text-foreground">
                  {item.value}
                </span>
              </Card>
            ) : (
              <Card className="flex flex-col space-y-1 p-3.5 opacity-0">
                <span className="text-xs uppercase">placeholder</span>
                <span className="text-sm">placeholder</span>
              </Card>
            )}
          </div>
        ))}
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages - 1))}
        disabled={currentPage >= totalPages - 1}
        className="shrink-0 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </TabsContent>
  );
}
