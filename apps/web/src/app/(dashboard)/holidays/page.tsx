"use client";

import { ApiService } from "@/services/api.service";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useState, useMemo } from "react";

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
      <div className="p-6 text-sm text-muted-foreground">Ładowanie...</div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-sm text-destructive">
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

      <div className="flex-1 overflow-auto p-6">
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-3 py-3 text-center text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Data
                </th>
                <th className="px-3 py-3 text-center text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Nazwa święta
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredHolidays.map((holiday) => (
                <tr key={holiday.date} className="hover:bg-muted/30 transition">
                  <td className="py-3 px-4 font-medium text-foreground text-center">
                    {formatDate(holiday.date)}
                  </td>
                  <td className="py-3 px-4 text-muted-foreground text-center">
                    {holiday.name}
                  </td>
                </tr>
              ))}
              {filteredHolidays.length === 0 && (
                <tr>
                  <td
                    colSpan={2}
                    className="py-6 text-center text-muted-foreground"
                  >
                    Brak świąt pasujących do kryteriów wyszukiwania
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
