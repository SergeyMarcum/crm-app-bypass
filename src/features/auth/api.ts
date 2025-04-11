// src/features/auth/api.ts
import axios from "axios";
import { authApi } from "@/shared/api/authApi";

export interface LoginResponse {
  status: string;
  token: string;
  user: {
    login: string;
    system_login: string;
    full_name: string;
    email: string;
    position: string;
    department: string;
    company: string;
    phone: string;
  };
}

export interface DomainListResponse {
  [key: string]: string;
}

export const login = async (
  username: string,
  password: string,
  domain: string
): Promise<LoginResponse> => {
  try {
    const response = await authApi.login({ username, password, domain });
    return {
      status: "OK",
      token: response.token,
      user: {
        login: response.username,
        system_login: `${domain}_${response.username}`,
        full_name: response.username,
        email: "",
        position: "",
        department: "",
        company: "",
        phone: "",
      },
    };
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

export const loginTest = async (
  username: string,
  password: string,
  domain: string
): Promise<LoginResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (
        username === "test" &&
        password === "test123" &&
        domain === "orenburg"
      ) {
        resolve({
          status: "OK",
          token: "mock-session-code-12345",
          user: {
            login: username,
            system_login: `${domain}_${username}`,
            full_name: "Тестовый Пользователь",
            email: `${username}@test.com`,
            position: "",
            department: "",
            company: "",
            phone: "",
          },
        });
      } else {
        throw new Error("Неверный логин или пароль (тестовый режим).");
      }
    }, 500);
  });
};

export const fetchDomains = async (): Promise<DomainListResponse> => {
  try {
    const domains = await authApi.getDomainList();
    return domains;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (!error.response) {
        throw new Error("Ошибка сети. Проверьте подключение.");
      }
      throw new Error(
        `Ошибка получения списка доменов: ${error.response.data?.detail || "Неизвестная ошибка"}`
      );
    }
    throw new Error("Неизвестная ошибка.");
  }
};

export const fetchDomainsTest = async (): Promise<DomainListResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        orenburg: "Оренбургский филиал (тестовый)",
        irf: "Иркутский филиал",
      });
    }, 500);
  });
};
