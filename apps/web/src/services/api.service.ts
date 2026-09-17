import { UserProfile } from "@/store/useAuthStore";
import { AddEmployeeDto, CompanyNameAndId, Employee, Holiday } from "@/types";
import { apiRequest } from "./api-request";

export class ApiService {
  static async login(email: string, password: string): Promise<UserProfile> {
    const data = await apiRequest<UserProfile>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      hideToastOnNetworkError: true,
    });
    return data;
  }

  static async logout(): Promise<void> {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
  }

  static async getEmployees(): Promise<Employee[]> {
    const data = await apiRequest<Employee[]>("/api/employees");
    return data;
  }

  static async getEmployee(id: string): Promise<Employee> {
    const data = await apiRequest<Employee>(`/api/employees/${id}`);
    return data;
  }

  static async getHolidays(): Promise<Holiday[]> {
    const data = await apiRequest<Holiday[]>("/api/holidays");
    return data;
  }

  static async getCompaniesNamesAndIds(): Promise<CompanyNameAndId[]> {
    const data = await apiRequest<CompanyNameAndId[]>("/api/companies");
    return data;
  }

  static async addEmployee(employee: AddEmployeeDto): Promise<Employee> {
    const data = await apiRequest<Employee>("/api/employees", {
      method: "POST",
      body: JSON.stringify(employee),
    });
    return data;
  }

  static async getPositions(): Promise<string[]> {
    const data = await apiRequest<string[]>("/api/employees/positions");
    return data;
  }

  static async isPeselAvailable(pesel: string): Promise<boolean> {
    const data = await apiRequest<boolean>(
      `/api/employees/pesel/check-availability?pesel=${pesel}`,
    );
    return data;
  }

  static async getEmployeeById(id: string): Promise<Employee> {
    const data = await apiRequest<Employee>(`/api/employees/${id}`);
    return data;
  }
}
