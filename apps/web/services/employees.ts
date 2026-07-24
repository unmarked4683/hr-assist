import type {
  CreateEmployeeInput,
  Employee,
  EmployeeSummary,
} from "@/lib/types/employee";
import { apiClient } from "@/services/api-client";
import {
  createMockEmployee,
  getMockEmployeeById,
  getMockEmployees,
} from "@/services/mock-data";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

export async function listEmployees(): Promise<EmployeeSummary[]> {
  if (USE_MOCK) return getMockEmployees();
  return apiClient<EmployeeSummary[]>("/employees");
}

export async function getEmployee(id: string): Promise<Employee> {
  if (USE_MOCK) {
    const employee = getMockEmployeeById(id);
    if (!employee) throw new Error("Nie znaleziono pracownika");
    return employee;
  }
  return apiClient<Employee>(`/employees/${id}`);
}

export async function createEmployee(input: CreateEmployeeInput): Promise<Employee> {
  if (USE_MOCK) return createMockEmployee(input);
  return apiClient<Employee>("/employees", { method: "POST", body: input });
}
