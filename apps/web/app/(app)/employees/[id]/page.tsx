"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { CalendarModule } from "@/components/calendar/calendar-module";
import { EmployeeProfileSection } from "@/components/employees/employee-profile-section";
import { ErrorMessage } from "@/components/ui/error-message";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ROUTES } from "@/lib/constants/navigation";
import type { Employee } from "@/lib/types/employee";
import { getEmployee } from "@/services/employees";

export default function EmployeeDetailPage() {
  const params = useParams<{ id: string }>();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEmployee = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getEmployee(params.id);
        setEmployee(data);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Nie udało się wczytać danych pracownika",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadEmployee();
  }, [params.id]);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-6">
      <Link
        href={ROUTES.employees}
        className="mb-6 inline-flex shrink-0 items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="size-4" />
        Lista pracowników
      </Link>

      {isLoading ? (
        <LoadingSpinner className="flex-1" />
      ) : error || !employee ? (
        <ErrorMessage message={error ?? "Nie znaleziono pracownika"} />
      ) : (
        <>
          <EmployeeProfileSection employee={employee} />

          <CalendarModule employeeId={employee.id} className="mt-6 min-h-0 flex-1" />
        </>
      )}
    </div>
  );
}
