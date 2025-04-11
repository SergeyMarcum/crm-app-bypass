// src/shared/api/authApi.ts
import { api, testApi } from "./axios";
import { useAuthStore } from "@/features/auth/store";

interface DomainList {
  [key: string]: string;
}

interface LoginData {
  username: string;
  password: string;
  domain: string;
}

interface LoginResponse {
  id: number;
  username: string;
  password: string;
  domain: string;
  token: string;
}

export const authApi = {
  getDomainList: async (): Promise<DomainList> => {
    const { isTestMode } = useAuthStore.getState();
    try {
      const response = await (isTestMode ? testApi : api).get("/domain-list"); // Убираем /api/ из пути
      console.log("Domains response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Fetch domains error:", error);
      if (isTestMode) {
        return {
          orenburg: "Оренбургский филиал (тестовый)",
          irf: "Иркутский филиал",
        };
      }
      throw error;
    }
  },

  login: async (data: LoginData): Promise<LoginResponse> => {
    const { isTestMode } = useAuthStore.getState();
    if (isTestMode) {
      const response = await testApi.get("/login");
      const user = response.data.find(
        (u: LoginResponse) =>
          u.username === data.username &&
          u.password === data.password &&
          u.domain === data.domain
      );
      if (!user) throw new Error("Неверные учетные данные");
      return user;
    } else {
      const response = await api.post("/login", data); // Убираем /api/ из пути
      return response.data;
    }
  },

  logout: async (): Promise<void> => {
    const { isTestMode } = useAuthStore.getState();
    if (isTestMode) {
      console.log("Тестовый logout");
    } else {
      await api.get("/logout"); // Убираем /api/ из пути
    }
  },

  checkSession: async (): Promise<void> => {
    const { isTestMode } = useAuthStore.getState();
    if (!isTestMode) {
      await api.get("/check-session"); // Убираем /api/ из пути
    } else {
      console.log("Проверка сессии в тестовом режиме не требуется");
    }
  },
};
