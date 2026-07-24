"use client";

import { useEffect, useState } from "react";

import { AddEmployeeModal } from "@/components/employees/add-employee-modal";
import { EmployeeTable } from "@/components/employees/employee-table";
import { EmployeeTopBar } from "@/components/employees/employee-top-bar";
import { ErrorMessage } from "@/components/ui/error-message";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useEmployeeSearch } from "@/lib/hooks/use-employee-search";
import type { CreateEmployeeInput, EmployeeSummary } from "@/lib/types/employee";
import { createEmployee, listEmployees } from "@/services/employees";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<EmployeeSummary[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await listEmployees();
        if (!cancelled) {
          setEmployees(data);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Nie udało się wczytać listy pracowników",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [reloadToken]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const refreshEmployees = () => setReloadToken((value) => value + 1);

  const filteredEmployees = useEmployeeSearch(employees, query);

  const handleCreate = async (input: CreateEmployeeInput) => {
    await createEmployee(input);
    refreshEmployees();
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <EmployeeTopBar
        query={query}
        onQueryChange={setQuery}
        onAddClick={() => setIsModalOpen(true)}
      />

      <div className="flex min-h-0 flex-1 flex-col px-6 pb-6 pt-4">
        {isLoading ? (
          <LoadingSpinner className="flex-1" />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : (
          <EmployeeTable employees={filteredEmployees} />
        )}
      </div>

      <AddEmployeeModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSubmit={handleCreate}
      />
    </div>
  );
}
