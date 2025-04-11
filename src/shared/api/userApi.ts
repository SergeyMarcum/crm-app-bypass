// src/shared/api/userApi.ts

import { api, testApi } from "./axios";
import { useAuthStore } from "@/features/auth/store";
import { User, UserResponse } from "@/entities/user";

export interface AllUsersCompanyResponse {
  users: User[];
  departments: { dep: string; id: string }[];
}

export const userApi = {
  // Редактирование пользователя
  editUser: async (
    data: Partial<User> & { user_id: number }
  ): Promise<void> => {
    const { isTestMode } = useAuthStore.getState();
    await (isTestMode ? testApi : api).put(
      isTestMode ? `/all-users-company/users/${data.user_id}` : "/edit-user",
      data
    );
  },

  editUserTest: async (
    data: Partial<User> & { user_id: number }
  ): Promise<void> => {
    await testApi.put(`/all-users-company/users/${data.user_id}`, data);
  },

  // Получение всех пользователей (простая версия)
  getAllUsers: async (): Promise<User[]> => {
    const { isTestMode } = useAuthStore.getState();
    const response = await (isTestMode ? testApi : api).get(
      isTestMode ? "/all-users-company/users" : "/users"
    );
    return response.data;
  },

  // Новый метод с параметрами (реальный вызов API с username и token)
  getAllUsersWithParams: async (
    domain: string,
    username: string,
    token: string
  ): Promise<UserResponse> => {
    const response = await api.get(
      `/all-users-company?domain=${domain}&username=${username}&session_code=${token}`
    );
    return response.data;
  },

  // Получение структуры пользователей и отделов
  getAllUsersCompany: async (): Promise<AllUsersCompanyResponse> => {
    const { isTestMode } = useAuthStore.getState();
    const response = await (isTestMode ? testApi : api).get(
      "/all-users-company"
    );
    return response.data;
  },

  // Тестовый аналог получения всех пользователей компании
  getAllUsersCompanyTest: async (
    domain: string
  ): Promise<AllUsersCompanyResponse> => {
    const response = await testApi.get("/all-users-company");
    return {
      users: response.data.users.filter((user: User) => user.domain === domain),
      departments: response.data.departments,
    };
  },

  // Новый метод — получение текущего авторизованного пользователя
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get("/current-user");
    return response.data;
  },

  // Увольнение пользователя
  dismissUser: async (user_id: number): Promise<void> => {
    const { isTestMode } = useAuthStore.getState();
    await (isTestMode ? testApi : api).put(
      isTestMode ? `/all-users-company/users/${user_id}` : "/dismiss-user",
      isTestMode ? { status_id: 4 } : { user_id }
    );
  },

  // Назначение администратором общества
  makeMainAdmin: async (user_id: number): Promise<void> => {
    const { isTestMode } = useAuthStore.getState();
    await (isTestMode ? testApi : api).put(
      isTestMode ? `/all-users-company/users/${user_id}` : "/make-main-admin",
      isTestMode ? { role_id: 1 } : { user_id }
    );
  },

  // Назначение администратором филиала
  makeCompanyAdmin: async (user_id: number): Promise<void> => {
    const { isTestMode } = useAuthStore.getState();
    await (isTestMode ? testApi : api).put(
      isTestMode
        ? `/all-users-company/users/${user_id}`
        : "/make-company-admin",
      isTestMode ? { role_id: 2 } : { user_id }
    );
  },

  // Получить список администраторов компании
  getCompanyAdmins: async (): Promise<User[]> => {
    const { isTestMode, domain } = useAuthStore.getState();
    if (isTestMode) {
      const response = await testApi.get("/all-users-company/users");
      return response.data.filter(
        (user: User) => user.role_id === 2 && user.domain === domain
      );
    }
    const response = await api.get("/users-show-company-admins");
    return response.data;
  },

  makeShiftManager: async (user_id: number): Promise<void> => {
    const { isTestMode } = useAuthStore.getState();
    await (isTestMode ? testApi : api).put(
      isTestMode
        ? `/all-users-company/users/${user_id}`
        : "/make-shift-manager",
      isTestMode ? { role_id: 3 } : { user_id }
    );
  },

  getShiftManagers: async (): Promise<User[]> => {
    const { isTestMode, domain } = useAuthStore.getState();
    if (isTestMode) {
      const response = await testApi.get("/all-users-company/users");
      return response.data.filter(
        (user: User) => user.role_id === 3 && user.domain === domain
      );
    }
    const response = await api.get("/users-show-shift-managers");
    return response.data;
  },

  makeOperator: async (user_id: number): Promise<void> => {
    const { isTestMode } = useAuthStore.getState();
    await (isTestMode ? testApi : api).put(
      isTestMode ? `/all-users-company/users/${user_id}` : "/make-operator",
      isTestMode ? { role_id: 4 } : { user_id }
    );
  },

  getOperators: async (): Promise<User[]> => {
    const { isTestMode, domain } = useAuthStore.getState();
    if (isTestMode) {
      const response = await testApi.get("/all-users-company/users");
      return response.data.filter(
        (user: User) => user.role_id === 4 && user.domain === domain
      );
    }
    const response = await api.get("/users-show-operators");
    return response.data;
  },

  // Получение доступных доменов
  getDomains: async (): Promise<string[]> => {
    const { isTestMode } = useAuthStore.getState();
    const response = await (isTestMode ? testApi : api).get("/domains");
    return response.data;
  },
};
