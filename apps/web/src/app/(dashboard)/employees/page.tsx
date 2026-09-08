"use client";

import { useMemo, useState } from "react";
import { MapPin, Plus, Search } from "lucide-react";

interface MockEmployee {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
  location: string;
  status: "ok" | "alert";
}

const MOCK_EMPLOYEES: MockEmployee[] = [
  {
    id: "e1",
    firstName: "Anna",
    lastName: "Kowalska",
    position: "Specjalista HR",
    location: "Biuro",
    status: "alert",
  },
  {
    id: "e2",
    firstName: "Piotr",
    lastName: "Nowak",
    position: "Brygadzista",
    location: "Teren",
    status: "ok",
  },
  {
    id: "e3",
    firstName: "Maria",
    lastName: "Wiśniewska",
    position: "Księgowa",
    location: "Biuro",
    status: "ok",
  },
  {
    id: "e4",
    firstName: "Tomasz",
    lastName: "Zieliński",
    position: "Operator maszyn",
    location: "Teren",
    status: "ok",
  },
  {
    id: "e5",
    firstName: "Karolina",
    lastName: "Dąbrowska",
    position: "Magazynier",
    location: "Biuro",
    status: "ok",
  },
];

const COLUMNS = [
  "Imię",
  "Nazwisko",
  "Stanowisko",
  "Lokalizacja",
  "Status",
] as const;

export default function EmployeesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEmployees = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return MOCK_EMPLOYEES;

    return MOCK_EMPLOYEES.filter(
      (employee) =>
        employee.firstName.toLowerCase().includes(query) ||
        employee.lastName.toLowerCase().includes(query) ||
        employee.position.toLowerCase().includes(query) ||
        employee.location.toLowerCase().includes(query),
    );
  }, [searchQuery]);

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
            placeholder="Szukaj pracowników..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="h-9 w-full rounded-lg border border-input bg-background pr-4 pl-9 text-sm text-foreground placeholder:text-muted-foreground transition focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
          />
        </div>
        <button
          type="button"
          onClick={() => console.log("dodawanie pracownika")}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm transition-all hover:opacity-90 active:scale-95"
          aria-label="Dodaj pracownika"
        >
          <Plus size={18} />
        </button>
      </header>

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
                        {employee.firstName}
                      </td>
                      <td className="px-3 py-2.5 text-center text-foreground">
                        {employee.lastName}
                      </td>
                      <td className="px-3 py-2.5 text-center text-muted-foreground">
                        {employee.position}
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        <span className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                          <MapPin size={10} />
                          {employee.location}
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
    </div>
  );
}
