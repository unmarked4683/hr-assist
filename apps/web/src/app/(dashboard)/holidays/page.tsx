"use client";

import { ApiService } from "@/services/api.service";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useState, useMemo } from "react";
import { polishName } from "./holidays-translations";

const COLUMNS = ["Data", "Nazwa święta"] as const;

export default function HolidaysPage() {
  const [search, setSearch] = useState("");

  const {
    data: holidays,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["holidays"],
    queryFn: async () => await ApiService.getHolidays(),
  });

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("pl-PL", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(date);
    } catch {
      return dateString;
    }
  };

  const filteredHolidays = useMemo(() => {
    if (!holidays) return [];
    return holidays.filter(
      (h) =>
        h.name.toLowerCase().includes(search.toLowerCase()) ||
        h.date.includes(search) ||
        formatDate(h.date).toLowerCase().includes(search.toLowerCase()),
    );
  }, [holidays, search]);

  if (isLoading) {
    return (
      <div className="p-6 text-center text-sm text-muted-foreground">
        Ładowanie dni wolnych...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-center text-sm text-destructive">
        Błąd podczas ładowania dni wolnych
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex max-w-full shrink-0 items-center gap-3 border-b border-border bg-card px-6 py-4">
        <div className="relative flex-1 grow">
          <Search
            size={15}
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            placeholder="Szukaj świąt..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="h-9 w-full rounded-lg border border-input bg-background pr-4 pl-9 text-sm text-foreground placeholder:text-muted-foreground transition focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
          />
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-hidden px-6 py-5">
        <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <table className="w-full shrink-0 table-fixed text-sm">
            <colgroup>
              <col className="w-[40%]" />
              <col className="w-[60%]" />
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
                <col className="w-[40%]" />
                <col className="w-[60%]" />
              </colgroup>
              <tbody className="divide-y divide-border">
                {filteredHolidays.length === 0 ? (
                  <tr>
                    <td
                      colSpan={2}
                      className="py-12 text-center text-sm text-muted-foreground"
                    >
                      Brak świąt pasujących do kryteriów wyszukiwania
                    </td>
                  </tr>
                ) : (
                  filteredHolidays.map((holiday, index) => (
                    <tr
                      key={holiday.date}
                      className={`border-b border-border transition hover:bg-muted/30 ${
                        index % 2 === 1 ? "bg-table-row-alt" : ""
                      }`}
                    >
                      <td className="px-3 py-2.5 text-center font-medium text-foreground">
                        {formatDate(holiday.date)}
                      </td>
                      <td className="px-3 py-2.5 text-center text-muted-foreground">
                        {polishName(holiday.name)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
