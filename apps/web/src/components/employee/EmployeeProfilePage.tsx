"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SectionErrorBlock } from "@/components/ui/section-error-block";
import { ApiService } from "@/services/api.service";
import { QueryKeysService } from "@/services/query-keys.service";
import { EmployeeHeader } from "./EmployeeHeader";
import { EmployeeInfoTab } from "./EmployeeInfoTab";
import { EmployeeLeaveTab } from "./EmployeeLeaveTab";
import { EmployeeCalendar } from "./calendar/EmployeeCalendar";

type EmployeeTab = "dane" | "urlopy";

export function EmployeeProfilePage() {
  const { id: employeeId } = useParams();

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<EmployeeTab>("dane");
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
    queryKey: QueryKeysService.employeeDetails({
      employeeId: employeeId as string,
    }),
    queryFn: async () => await ApiService.getEmployeeById(employeeId as string),
    enabled: !!employeeId,
  });

  // Pobieranie danych o urlopach z uwzględnieniem struktury QueryKeysService
  const { data: leaveData } = useQuery({
    queryKey: QueryKeysService.employeeLeave({
      employeeId: employeeId as string,
    }),
    queryFn: async () =>
      await ApiService.getEmployeeLeave(employeeId as string),
    enabled: !!employeeId,
  });

  if (isLoading) {
    return (
      <div className="flex h-100 w-full items-center justify-center p-6">
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
      <EmployeeHeader name={employee.name} surname={employee.surname} />

      {/* 3. Główna karta */}
      <Card size="sm" className="flex shrink-0 flex-col gap-2 px-4">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as EmployeeTab)}
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
              <EmployeeInfoTab
                employee={employee}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
              <EmployeeLeaveTab leaveData={leaveData} />
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
