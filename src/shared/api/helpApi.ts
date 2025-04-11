import { api, testApi } from "./axios";
import { useAuthStore } from "@/features/auth/store";

interface SupportRequest {
  subject: string;
  type: string;
  name: string;
  message: string;
}

export const helpApi = {
  sendSupportRequest: async (data: SupportRequest): Promise<void> => {
    const { isTestMode } = useAuthStore.getState();
    if (isTestMode) {
      await testApi.post("/support-requests", data);
      console.log("Тестовый запрос в техподдержку отправлен:", data);
    } else {
      await api.post("/support-request", data);
    }
  },
};
