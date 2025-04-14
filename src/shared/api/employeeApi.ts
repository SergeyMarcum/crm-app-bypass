import { api } from "./axios";
import { Employee } from "@/entities/employee";

// Интерфейс для данных из db.json
interface DbUser {
  id: string;
  full_name: string;
  email: string | null;
  position: string | null;
  department: string | null;
  phone: string | null;
  status_id: string | number | null;
  avatar?: string;
}

// Интерфейс для ответа FastAPI
interface EmployeeApiResponse {
  employees: Array<{
    id: number;
    full_name: string;
    email: string | null;
    position: string | null;
    department: string | null;
    phone: string | null;
    hire_date?: string;
    status: string;
    status_id: string | number | null;
    manager_id: number | null;
    avatar?: string;
  }>;
  total: number;
}

// Маппинг статусов
const statusMap: { [key: string]: Employee["status"] } = {
  "1": "active",
  "2": "on_leave",
  "3": "on_leave",
  "4": "on_leave",
};

// Функция для получения сотрудников по отделу
export const getEmployeesByDepartment = async (
  department: string,
  isTestMode: boolean
): Promise<Employee[]> => {
  if (!department) return [];

  if (isTestMode) {
    try {
      const response = await fetch("/db.json");
      if (!response.ok) throw new Error("Не удалось загрузить данные");
      const data = await response.json();
      const allUsers: DbUser[] = data["all-users-company"] || [];
      return allUsers
        .filter((user) => user.department === department)
        .map((user) => ({
          id: parseInt(user.id) || 0,
          full_name: user.full_name || "Не указано",
          email: user.email || null,
          position: user.position || null,
          department: user.department || null,
          phone: user.phone || null,
          hire_date: "",
          status: statusMap[user.status_id?.toString() ?? ""] || "active",
          status_id: user.status_id || null,
          manager_id: null,
          avatar: user.avatar || `/assets/avatar-${user.id || 0}.png`,
        }));
    } catch (err) {
      throw new Error(
        err instanceof Error
          ? `Ошибка загрузки данных из JSON-сервера: ${err.message}`
          : "Ошибка загрузки данных из JSON-сервера"
      );
    }
  } else {
    try {
      const response = await api.get<EmployeeApiResponse>("/employees", {
        params: { department },
      });
      return response.data.employees.map((user) => ({
        id: user.id || 0,
        full_name: user.full_name || "Не указано",
        email: user.email || null,
        position: user.position || null,
        department: user.department || null,
        phone: user.phone || null,
        hire_date: user.hire_date || "",
        status: (user.status as Employee["status"]) || "active", // Приводим к нужному типу
        status_id: user.status_id || null,
        manager_id: user.manager_id || null,
        avatar: user.avatar || "/assets/avatar.png",
      }));
    } catch (err) {
      throw new Error(
        err instanceof Error
          ? `Ошибка загрузки данных с FastAPI: ${err.message}`
          : "Ошибка загрузки данных с FastAPI"
      );
    }
  }
};
