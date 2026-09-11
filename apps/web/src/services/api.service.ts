import { UserProfile } from "@/store/useAuthStore";
import { Employee } from "@/types";
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
    await apiRequest<void>("/api/auth/logout", {
      method: "POST",
    });
  }

  static async getEmployees(): Promise<Employee[]> {
    const data = await apiRequest<Employee[]>("/api/employees");
    return data;
  }
}
