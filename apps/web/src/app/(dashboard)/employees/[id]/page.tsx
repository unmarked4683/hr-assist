"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Pencil,
  UserX,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

// Przykładowy obiekt danych odzwierciedlający strukturę z backendu
const mockEmployee = {
  id: "f838a483-d6e6-40a7-9951-d79c3956c9fb",
  name: "Szymon",
  surname: "Rzepisko",
  pesel: "65103053366",
  position: "HR Manager",
  location: 2,
  workHours: 6,
  workSchedule: {
    start: "08:00:00",
    end: "14:00:00",
  },
  employmentDate: "2025-11-01",
  contractType: 1,
  createdAt: "2026-09-14T09:09:37.847Z",
  updatedAt: "2026-09-14T09:09:37.847Z",
  firedAt: null,
  company: {
    id: "733af693-8e37-4e40-bb1a-ccd27d295858",
    name: "AKPO Serwis Krzysztof Bukowiec",
    nip: "8681327679",
    address: {
      street: "Zegartowice",
      houseNumber: 160,
      postCode: "32-415",
      city: "Raciechowice",
    },
  },
  leave: {
    base: 20,
    overdue: 0,
    current: 20,
  },
};

const ITEMS_PER_PAGE = 6;

export default function EmployeePage() {
  const [employee] = useState(mockEmployee);
  const [currentPage, setCurrentPage] = useState(0);

  // Mapowanie danych z payloadu na listę kafelków
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
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Powrót do listy pracowników
        </Link>
      </div>

      {/* 2. Nagłówek nawigacyjny i akcje */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">{fullNameUpper}</h1>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

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
      <Card className="h-[460px] min-h-[460px] p-6 flex flex-col justify-between">
        <Tabs
          defaultValue="dane"
          className="w-full h-full flex flex-col justify-between"
        >
          <TabsList className="grid w-64 grid-cols-2 mx-auto">
            <TabsTrigger value="dane">Dane pracownika</TabsTrigger>
            <TabsTrigger value="urlopy">Urlopy</TabsTrigger>
          </TabsList>

          {/* Zakładka: Dane pracownika */}
          <TabsContent
            value="dane"
            className="flex-1 mt-6 flex items-center justify-between gap-4"
          >
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
              disabled={currentPage === 0}
              className="disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none shrink-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="grid grid-cols-2 grid-rows-3 gap-4 flex-1 h-full">
              {paddedItems.map((item, idx) => (
                <div key={idx} className="h-full">
                  {item ? (
                    <Card className="h-full p-4 flex flex-col justify-center bg-muted/40">
                      <span className="text-xs text-muted-foreground uppercase font-medium">
                        {item.label}
                      </span>
                      <span className="text-sm font-semibold mt-1 truncate">
                        {item.value}
                      </span>
                    </Card>
                  ) : (
                    <div className="h-full border border-dashed rounded-lg opacity-0" />
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
              className="disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none shrink-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </TabsContent>

          {/* Zakładka: Urlopy */}
          <TabsContent
            value="urlopy"
            className="flex-1 mt-6 flex items-center justify-between gap-4"
          >
            {/* Element zastępczy rezerwujący przestrzeń po lewej strzałce */}
            <div className="w-10 shrink-0 invisible">
              <Button variant="outline" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 flex-1 h-full">
              {/* Urlop zaległy */}
              <Card className="h-full p-6 flex flex-col items-center justify-center space-y-6 bg-muted/40">
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
              <Card className="h-full p-6 flex flex-col items-center justify-center space-y-6 bg-muted/40">
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
            <div className="w-10 shrink-0 invisible">
              <Button variant="outline" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      {/* 4. Dolna sekcja: Kalendarz */}
      <Card className="p-6">
        <CardHeader className="p-0 mb-4">
          <CardTitle>Kalendarz</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* Tabela / Grid kalendarza do dodania w przyszłości */}
        </CardContent>
      </Card>
    </div>
  );
}
