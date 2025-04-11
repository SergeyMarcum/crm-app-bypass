import { api, testApi } from "./axios";
import { useAuthStore } from "@/features/auth/store";

interface ReportData {
  count_objects_with_secondary_tasks: number;
  unique_user_status_count: { role_id: number; count: number }[];
}

export const reportApi = {
  uploadReport: async (): Promise<ReportData> => {
    const { isTestMode } = useAuthStore.getState();
    const response = isTestMode
      ? await testApi.post("/dashboard") // В тестовом режиме используем моковые данные
      : await api.post("/upload-report");
    return response.data;
  },
};
