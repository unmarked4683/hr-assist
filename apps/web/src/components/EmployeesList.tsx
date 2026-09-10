import { useEffect, useState } from "react";
import { IEmployeeEntity as Employee } from "../../../api/src/modules/employees/employee.types";
import { MapPin } from "lucide-react";

const COLUMNS = [
  "Imię",
  "Nazwisko",
  "Stanowisko",
  "Lokalizacja",
  "Status",
] as const;

export default function EmployeesList() {
  const [employees, setEmployees] = useState<
    Array<Employee & { status: string }>
  >([]);

  const fetchEmployees = async (): Promise<
    Array<Employee & { status: string }>
  > => {
    const response = await fetch("/api/employees", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch employees");
    }

    const data = await response.json();
    const employees: Array<Employee & { status: string }> = data.map(
      (employee: Employee) => ({ ...employee, status: "ok" }),
    );
    return employees;
  };

  useEffect(() => {
    fetchEmployees().then(setEmployees);
  }, []);

  return (
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
              {employees.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-12 text-center text-sm text-muted-foreground"
                  >
                    Brak pracowników spełniających kryteria wyszukiwania.
                  </td>
                </tr>
              ) : (
                employees.map((employee, index) => (
                  <tr
                    key={employee.id}
                    className={`border-b border-border ${
                      index % 2 === 1 ? "bg-table-row-alt" : ""
                    }`}
                  >
                    <td className="px-3 py-2.5 text-center font-medium text-foreground">
                      {employee.name}
                    </td>
                    <td className="px-3 py-2.5 text-center text-foreground">
                      {employee.surname}
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
  );
}
