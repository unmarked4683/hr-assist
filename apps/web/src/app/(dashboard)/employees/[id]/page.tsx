"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Pencil,
  UserX,
  Trash2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { SectionErrorBlock } from "@/components/ui/section-error-block";
import { ApiService } from "@/services/api.service";
import { useParams } from "next/navigation";
import EmployeeCalendar from "@/components/employee-calendar";

const ITEMS_PER_PAGE = 6;

export default function EmployeePage() {
  const { id: employeeId } = useParams();

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<"dane" | "urlopy">("dane");
  const tabsContentRef = useRef<HTMLDivElement>(null);
  const [tabsContentHeight, setTabsContentHeight] = useState<number>();

  useLayoutEffect(() => {
    const node = tabsContentRef.current;
    if (!node) return;
    setTabsContentHeight(node.scrollHeight);
  }, [activeTab, currentPage]);

  const {
    data: employee,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["employee", employeeId],
    queryFn: async () => await ApiService.getEmployeeById(employeeId as string),
  });

  if (isLoading) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center p-6">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !employee) {
    return (
      <div className="flex h-full min-h-0 flex-col p-6">
        <SectionErrorBlock
          title="Błąd danych pracownika"
          description={
            error?.message || "Nie udało się pobrać szczegółów profilu."
          }
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const detailsList = [
    { label: "PESEL", value: employee.pesel },
    { label: "Stanowisko", value: employee.position },
    { label: "Data zatrudnienia", value: employee.employmentDate },
    {
      label: "Godziny pracy",
      value: `${employee.workSchedule.start.slice(0, 5)} - ${employee.workSchedule.end.slice(0, 5)} (${employee.workHours}h)`,
    },
    { label: "Firma", value: employee.company.name },
    {
      label: "Typ umowy",
      value: employee.contractType === 1 ? "Umowa o pracę" : "Inna",
    },
    { label: "NIP", value: employee.company.nip },
    {
      label: "Adres firmy",
      value: `${employee.company.address.street} ${employee.company.address.houseNumber}, ${employee.company.address.city}`,
    },
  ];

  const totalPages = Math.ceil(detailsList.length / ITEMS_PER_PAGE);
  const currentItems = detailsList.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE,
  );

  const paddedItems = [
    ...currentItems,
    ...Array.from({ length: ITEMS_PER_PAGE - currentItems.length }, () => null),
  ];

  const fullNameUpper = `${employee.name} ${employee.surname}`.toUpperCase();

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 overflow-hidden px-6 py-4">
      {/* 1. Odnośnik powrotny */}
      <div className="shrink-0">
        <Link
          href="/employees"
          className="inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Powrót do listy pracowników
        </Link>
      </div>

      {/* 2. Nagłówek nawigacyjny i akcje */}
      <div className="mb-2 flex shrink-0 items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">{fullNameUpper}</h1>

        <Card className="p-1">
          <div className="flex space-x-1">
            <Button variant="ghost" size="icon" title="Raport">
              <FileText className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" title="Edytuj">
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" title="Zwolnij">
              <UserX className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              title="Usuń"
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>

      {/* 3. Główna karta */}
      <Card size="sm" className="flex shrink-0 flex-col gap-2 px-4">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "dane" | "urlopy")}
          className="w-full gap-2"
        >
          <TabsList className="mx-auto grid w-64 grid-cols-2">
            <TabsTrigger value="dane">Dane pracownika</TabsTrigger>
            <TabsTrigger value="urlopy">Urlopy</TabsTrigger>
          </TabsList>

          <div
            style={{ height: tabsContentHeight }}
            className="overflow-hidden transition-[height] duration-200 ease-in-out"
          >
            <div ref={tabsContentRef} className="py-1.5">
              {/* Zakładka: Dane pracownika */}
              <TabsContent value="dane" className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 0))
                  }
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
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
                  }
                  disabled={currentPage >= totalPages - 1}
                  className="shrink-0 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </TabsContent>

              {/* Zakładka: Urlopy */}
              <TabsContent value="urlopy" className="flex items-center gap-4">
                <div className="invisible w-10 shrink-0">
                  <Button variant="outline" size="icon">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid flex-1 grid-cols-2 gap-3">
                  <Card className="flex flex-col items-center justify-center gap-2 bg-muted/40 p-3.5">
                    <h3 className="text-sm font-semibold">Urlop zaległy</h3>
                    <Progress
                      value={
                        employee.leave.base > 0
                          ? (employee.leave.overdue / employee.leave.base) * 100
                          : 0
                      }
                      className="w-3/4"
                    />
                    <span className="text-xs font-medium text-muted-foreground">
                      {employee.leave.overdue} / {employee.leave.base} dni
                    </span>
                  </Card>

                  <Card className="flex flex-col items-center justify-center gap-2 bg-muted/40 p-3.5">
                    <h3 className="text-sm font-semibold">Urlop aktualny</h3>
                    <Progress
                      value={
                        employee.leave.base > 0
                          ? (employee.leave.current / employee.leave.base) * 100
                          : 0
                      }
                      className="w-3/4"
                    />
                    <span className="text-xs font-medium text-muted-foreground">
                      {employee.leave.current} / {employee.leave.base} dni
                    </span>
                  </Card>
                </div>

                <div className="invisible w-10 shrink-0">
                  <Button variant="outline" size="icon">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </Card>

      <Card size="sm" className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <CardContent className="min-h-0 flex-1 overflow-hidden">
          <EmployeeCalendar employeeId={employeeId as string} />
        </CardContent>
      </Card>
    </div>
  );
}
