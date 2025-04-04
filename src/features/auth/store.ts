import { create } from "zustand";
import { persist } from "zustand/middleware";
import { login as apiLogin } from "./api";
import { useNavigate } from "react-router-dom"; // Для использования в компонентах

interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
  token: string | null;
  isTestMode: boolean;
  login: (
    username: string,
    password: string,
    domain?: string,
    testMode?: boolean
  ) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      isAuthenticated: false,
      username: null,
      token: null,
      isTestMode: false,

      login: async (
        username,
        password,
        domain = "orenburg",
        testMode = false
      ) => {
        if (testMode) {
          set({
            isAuthenticated: true,
            username: "testuser",
            token: "test-token",
            isTestMode: true,
          });
          sessionStorage.setItem("username", "testuser");
          sessionStorage.setItem("token", "test-token");
          return;
        }

        const response = await apiLogin(username, password, domain);
        const token = response.token;
        const user = response.username || username;

        if (!token || !user) {
          throw new Error(
            "Ошибка аутентификации: токен или имя пользователя отсутствуют"
          );
        }

        set({
          isAuthenticated: true,
          username: user,
          token,
          isTestMode: false,
        });

        sessionStorage.setItem("username", user);
        sessionStorage.setItem("token", token);
      },

      logout: () => {
        set({
          isAuthenticated: false,
          username: null,
          token: null,
          isTestMode: false,
        });
        sessionStorage.clear();
        localStorage.clear();
        // Убираем window.location.href, перенаправление будет в компонентах
      },
    }),
    { name: "auth-storage" }
  )
);
