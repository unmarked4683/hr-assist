"use client";

import { useState } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ApiService } from "@/services/api.service";
import { useParams } from "next/navigation";

const ITEMS_PER_PAGE = 6;

export default function EmployeePage() {
  const { id: employeeId } = useParams();

  const [currentPage, setCurrentPage] = useState<number>(0);

  const {
    data: employee,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["employee", employeeId],
    queryFn: async () => await ApiService.getEmployeeById(employeeId as string),
  });

  if (isLoading) {
    return (
      <div className="flex h-[500px] w-full items-center justify-center p-6">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !employee) {
    return (
      <div className="p-6 text-center text-destructive">
        Wystąpił błąd podczas pobierania danych pracownika.
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

  // Dopełnienie do 6 kafelków w celu utrzymania stałej symetrii i wymiaru karty
  const paddedItems = [
    ...currentItems,
    ...Array.from({ length: ITEMS_PER_PAGE - currentItems.length }, () => null),
  ];

  const fullNameUpper = `${employee.name} ${employee.surname}`.toUpperCase();

  return (
    <div className="space-y-6 p-6">
      {/* 1. Odnośnik powrotny */}
      <div>
        <Link
          href="/employees"
          className="inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Powrót do listy pracowników
        </Link>
      </div>

      {/* 2. Nagłówek nawigacyjny i akcje */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">{fullNameUpper}</h1>

        {/* Karta z akcjami (wyłącznie ikony) */}
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

      {/* 3. Główna karta (stała wysokość, zero layout shift) */}
      <Card className="flex h-[460px] min-h-[460px] flex-col justify-between p-6">
        <Tabs
          defaultValue="dane"
          className="flex h-full w-full flex-col justify-between"
        >
          <TabsList className="mx-auto grid w-64 grid-cols-2">
            <TabsTrigger value="dane">Dane pracownika</TabsTrigger>
            <TabsTrigger value="urlopy">Urlopy</TabsTrigger>
          </TabsList>

          {/* Zakładka: Dane pracownika */}
          <TabsContent
            value="dane"
            className="mt-6 flex flex-1 items-center justify-between gap-4"
          >
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
              disabled={currentPage === 0}
              className="shrink-0 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="grid flex-1 grid-cols-2 grid-rows-3 gap-4 h-full">
              {paddedItems.map((item, idx) => (
                <div key={idx} className="h-full">
                  {item ? (
                    <Card className="flex h-full flex-col justify-center bg-muted/40 p-4">
                      <span className="text-xs font-medium uppercase text-muted-foreground">
                        {item.label}
                      </span>
                      <span className="mt-1 truncate text-sm font-semibold">
                        {item.value}
                      </span>
                    </Card>
                  ) : (
                    <div className="h-full rounded-lg border border-dashed opacity-0" />
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
          <TabsContent
            value="urlopy"
            className="mt-6 flex flex-1 items-center justify-between gap-4"
          >
            {/* Element zastępczy rezerwujący przestrzeń po lewej strzałce */}
            <div className="invisible w-10 shrink-0">
              <Button variant="outline" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid flex-1 grid-cols-2 gap-4 h-full">
              {/* Urlop zaległy */}
              <Card className="flex h-full flex-col items-center justify-center space-y-6 bg-muted/40 p-6">
                <h3 className="text-base font-semibold">Urlop zaległy</h3>
                <Progress
                  value={
                    employee.leave.base > 0
                      ? (employee.leave.overdue / employee.leave.base) * 100
                      : 0
                  }
                  className="w-3/4"
                />
                <span className="text-sm font-medium text-muted-foreground">
                  {employee.leave.overdue} / {employee.leave.base} dni
                </span>
              </Card>

              {/* Urlop aktualny */}
              <Card className="flex h-full flex-col items-center justify-center space-y-6 bg-muted/40 p-6">
                <h3 className="text-base font-semibold">Urlop aktualny</h3>
                <Progress
                  value={
                    employee.leave.base > 0
                      ? (employee.leave.current / employee.leave.base) * 100
                      : 0
                  }
                  className="w-3/4"
                />
                <span className="text-sm font-medium text-muted-foreground">
                  {employee.leave.current} / {employee.leave.base} dni
                </span>
              </Card>
            </div>

            {/* Element zastępczy rezerwujący przestrzeń po prawej strzałce */}
            <div className="invisible w-10 shrink-0">
              <Button variant="outline" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      {/* 4. Dolna sekcja: Kalendarz */}
      <Card className="p-6">
        <CardHeader className="mb-4 p-0">
          <CardTitle>Kalendarz</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* Tabela / Grid kalendarza do dodania w przyszłości */}
        </CardContent>
      </Card>
    </div>
  );
}
