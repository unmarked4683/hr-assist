"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { CalendarModule } from "@/components/calendar/calendar-module";
import { EmployeeDataTab } from "@/components/employees/employee-data-tab";
import { LeaveTab } from "@/components/employees/leave-tab";
import { ErrorMessage } from "@/components/ui/error-message";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

  if (isLoading) {
    return <LoadingSpinner className="h-full" />;
  }

  if (error || !employee) {
    return <ErrorMessage message={error ?? "Nie znaleziono pracownika"} className="m-6" />;
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-6">
      <div className="shrink-0">
        <Tabs defaultValue="data">
          <TabsList>
            <TabsTrigger value="data">Dane pracownika</TabsTrigger>
            <TabsTrigger value="leave">Urlopy</TabsTrigger>
          </TabsList>
          <TabsContent value="data" className="mt-4">
            <EmployeeDataTab employee={employee} />
          </TabsContent>
          <TabsContent value="leave" className="mt-4">
            <LeaveTab employee={employee} />
          </TabsContent>
        </Tabs>
      </div>

      <CalendarModule employeeId={employee.id} className="mt-6 min-h-0 flex-1" />
    </div>
  );
}
