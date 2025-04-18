import axios, { AxiosInstance } from "axios";

const baseURL = import.meta.env.VITE_API_URL; // URL FastAPI из .env

const api: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

// Перехватчик запросов: добавляем session_code из localStorage
api.interceptors.request.use((config) => {
  const sessionCode = localStorage.getItem("session_code");
  if (sessionCode) {
    config.params = { ...config.params, session_code: sessionCode };
  }
  return config;
});

// Перехватчик ответов: обработка ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("session_code");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
