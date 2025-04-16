import axios from "axios";
import { useAuthStore } from "@/features/auth/store";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://192.168.1.248:8080", // FastAPI адрес
  timeout: 10000,
});

const testApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL_TEST || "http://localhost:3001", // JSON-сервер
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
    console.error("API error:", error.message);
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export { api, testApi };
export default { api, testApi };
