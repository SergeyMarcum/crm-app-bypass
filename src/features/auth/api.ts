import api from "../../shared/api/axios";
import axios from "axios";

interface LoginResponse {
  token: string;
  username?: string;
}

export const login = async (
  username: string,
  password: string,
  domain: string
): Promise<LoginResponse> => {
  try {
    const response = await api.post("/login", { username, password, domain });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (!error.response) {
        throw new Error("Ошибка сети. Проверьте подключение.");
      }
      switch (error.response.status) {
        case 401:
          throw new Error("Неверный логин или пароль.");
        case 403:
          throw new Error("У вас нет прав доступа.");
        default:
          throw new Error(
            `Ошибка авторизации: ${error.response.data?.detail || "Неизвестная ошибка"}`
          );
      }
    }
    throw new Error("Неизвестная ошибка.");
  }
};

export const fetchDomains = async (): Promise<Record<string, string>> => {
  try {
    const response = await api.get("/domain-list");
    console.log("Успешно получены домены:", response.data); // Для отладки
    return response.data;
  } catch (error: unknown) {
    console.error("Ошибка при получении доменов:", error);
    if (axios.isAxiosError(error)) {
      if (!error.response) {
        throw new Error("Ошибка сети. Проверьте подключение.");
      }
      throw new Error(
        `Ошибка получения доменов: ${error.response.data?.detail || "Неизвестная ошибка"}`
      );
    }
    throw new Error("Неизвестная ошибка.");
  }
};
