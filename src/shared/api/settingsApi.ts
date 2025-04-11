import { api, testApi } from "./axios";
import { useAuthStore } from "@/features/auth/store";
import { User } from "@/entities/user";

interface ProfileData {
  full_name: string;
  email: string;
  phone: string;
  status: string;
  avatar?: string;
}

interface Settings {
  theme: "light" | "dark" | "system";
}

export const settingsApi = {
  getSettings: async (): Promise<Settings> => {
    const { theme } = useAuthStore.getState();
    return { theme: theme || "system" };
  },
  updateProfile: async (data: Partial<ProfileData>): Promise<void> => {
    const { isTestMode, user } = useAuthStore.getState();
    const typedUser = user as User; // Используем тип User
    if (!typedUser?.id) throw new Error("Пользователь не авторизован");
    if (isTestMode) {
      await testApi.patch(`/all-users-company/users/${typedUser.id}`, data);
    } else {
      await api.put("/edit-user", { user_id: typedUser.id, ...data });
    }
  },
  updateTheme: async (theme: "light" | "dark" | "system"): Promise<void> => {
    useAuthStore.getState().setTheme(theme);
  },
  deleteAccount: async (): Promise<void> => {
    const { isTestMode, user } = useAuthStore.getState();
    const typedUser = user as User; // Используем тип User
    if (!typedUser?.id) throw new Error("Пользователь не авторизован");
    if (isTestMode) {
      await testApi.patch(`/all-users-company/users/${typedUser.id}`, {
        status_id: 4,
      });
    } else {
      await api.put("/dismiss-user", { user_id: typedUser.id });
    }
  },
};
