// src/features/auth/store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { login, loginTest } from "./api";
import { User } from "@/entities/user";

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  sessionCode: string | null;
  domain: string | null;
  username: string | null;
  isTestMode: boolean;
  theme: "light" | "dark" | "system";
  login: (
    username: string,
    password: string,
    domain?: string,
    testMode?: boolean
  ) => Promise<void>;
  logout: () => void;
  setTheme: (theme: "light" | "dark" | "system") => void;
  updateUser: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      sessionCode: null,
      domain: null,
      username: null,
      isTestMode: localStorage.getItem("apiMode") === "test",
      theme: "system",
      login: async (
        username: string,
        password: string,
        domain = "orenburg",
        testMode = false
      ) => {
        const response = testMode
          ? await loginTest(username, password, domain)
          : await login(username, password, domain);

        if (response.status !== "OK" || !response.token) {
          throw new Error("Ошибка аутентификации: токен отсутствует");
        }

        const user: User = {
          id: testMode ? 1 : 0, // В реальном режиме ID может быть получен с бэкенда
          login: response.user.login,
          system_login: response.user.system_login,
          full_name: response.user.full_name || null,
          company: response.user.company || null,
          email: response.user.email || null,
          role_id: 1, // Пока фиксированное значение
          status_id: testMode ? 1 : null,
          domain,
          position: response.user.position || null,
          department: response.user.department || null,
          phone: response.user.phone || null,
          name: response.user.login, // Используем login как name
          token: response.token,
          theme: "system",
          avatar: testMode ? "/assets/avatar-1.png" : "/assets/avatar.png",
          status: "работает",
        };

        set({
          isAuthenticated: true,
          user,
          token: response.token,
          sessionCode: response.token, // Используем token как sessionCode
          domain,
          username,
          isTestMode: testMode,
          theme: "system",
        });

        sessionStorage.setItem("user", JSON.stringify(user));
        sessionStorage.setItem("token", response.token);
        localStorage.setItem("token", response.token);
      },
      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          token: null,
          sessionCode: null,
          domain: null,
          username: null,
          isTestMode: false,
          theme: "system",
        });
        sessionStorage.clear();
        localStorage.clear();
      },
      setTheme: (theme) =>
        set((state) => ({
          ...state,
          theme,
          user: state.user ? { ...state.user, theme } : null,
        })),
      updateUser: (updates) =>
        set((state) => ({
          ...state,
          user: state.user ? { ...state.user, ...updates } : null,
        })),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        sessionCode: state.sessionCode,
        domain: state.domain,
        username: state.username,
        isAuthenticated: state.isAuthenticated,
        isTestMode: state.isTestMode,
        theme: state.theme,
      }),
    }
  )
);
