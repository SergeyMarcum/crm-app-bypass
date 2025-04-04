import axios from "axios";

const api = axios.create({
  baseURL: "", // Убираем baseURL (VITE_API_URL=http://192.168.1.248:8080), чтобы запросы шли через прокси Vite
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token =
      sessionStorage.getItem("token") || localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
