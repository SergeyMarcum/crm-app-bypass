import { api, testApi } from "./axios";
import { useAuthStore } from "@/features/auth/store";

interface DashboardData {
  count_objects_with_secondary_tasks: number;
  unique_user_status_count: { role_id: number; count: number }[];
}

export const dashboardApi = {
  getDashboardData: async (): Promise<DashboardData> => {
    const { isTestMode } = useAuthStore.getState();
    const response = isTestMode
      ? await testApi.get("/dashboard")
      : await api.get("/dashboard");
    return response.data;
  },
};
