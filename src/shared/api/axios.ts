// src/shared/api/axios.ts
import axios from "axios";
import { useAuthStore } from "@/features/auth/store";

const api = axios.create({
  baseURL: "/api", // Используем относительный путь для прокси
  timeout: 10000,
});

const testApi = axios.create({
  baseURL: "http://localhost:3001", // Тестовый режим остается без изменений
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const { domain, username, sessionCode } = useAuthStore.getState();
  if (domain && username && sessionCode) {
    config.params = {
      ...config.params,
      domain,
      username,
      session_code: sessionCode,
    };
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export { api, testApi };
export default { api, testApi };
