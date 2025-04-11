import { api, testApi } from "./axios";
import { useAuthStore } from "@/features/auth/store";
import {
  NonCompliance,
  ParameterNonCompliance,
} from "@/entities/nonCompliance";

export const nonComplianceApi = {
  addNonCompliance: async (name: string): Promise<void> => {
    const { isTestMode } = useAuthStore.getState();
    if (isTestMode) {
      await testApi.post("/cases-of-non-compliance", { id: Date.now(), name });
    } else {
      await api.post("/add-new-non-compliance", { name });
    }
  },
  editNonCompliance: async (id: number, name: string): Promise<void> => {
    const { isTestMode } = useAuthStore.getState();
    if (isTestMode) {
      await testApi.put(`/cases-of-non-compliance/${id}`, { name });
    } else {
      await api.put("/edit-non-compliance", { id, name });
    }
  },
  deleteNonCompliance: async (id: number): Promise<void> => {
    const { isTestMode } = useAuthStore.getState();
    if (isTestMode) {
      await testApi.delete(`/cases-of-non-compliance/${id}`);
    } else {
      await api.delete("/delete-non-compliance", { data: { id } });
    }
  },
  getNonCompliances: async (): Promise<NonCompliance[]> => {
    const { isTestMode } = useAuthStore.getState();
    const response = isTestMode
      ? await testApi.get("/cases-of-non-compliance")
      : await api.get("/cases-of-non-compliance");
    return response.data;
  },
  addParameterNonCompliance: async (
    incongruity_id: number,
    parameter_id: number
  ): Promise<void> => {
    const { isTestMode } = useAuthStore.getState();
    if (isTestMode) {
      await testApi.post("/parameter-non-compliances", {
        id: Date.now(),
        incongruity_id,
        parameter_id,
      });
    } else {
      await api.post("/add-parameter-non-compliance", {
        incongruity_id,
        parameter_id,
      });
    }
  },
  editParameterNonCompliance: async (
    id: number,
    incongruity_id: number,
    parameter_id: number
  ): Promise<void> => {
    const { isTestMode } = useAuthStore.getState();
    if (isTestMode) {
      await testApi.put(`/parameter-non-compliances/${id}`, {
        incongruity_id,
        parameter_id,
      });
    } else {
      await api.put("/edit-parameter-non-compliance", {
        id,
        incongruity_id,
        parameter_id,
      }); // Исправлено
    }
  },
  deleteParameterNonCompliance: async (id: number): Promise<void> => {
    const { isTestMode } = useAuthStore.getState();
    if (isTestMode) {
      await testApi.delete(`/parameter-non-compliances/${id}`);
    } else {
      await api.delete("/delete-parameter-non-compliance", { data: { id } });
    }
  },
  getParameterNonCompliances: async (
    param_id: number
  ): Promise<NonCompliance[]> => {
    const { isTestMode } = useAuthStore.getState();
    if (isTestMode) {
      const response = await testApi.get("/parameter-non-compliances");
      const paramNonCompliances = response.data.filter(
        (pnc: ParameterNonCompliance) => pnc.parameter_id === param_id
      );
      const nonCompliances = await testApi.get("/cases-of-non-compliance");
      return nonCompliances.data.filter((nc: NonCompliance) =>
        paramNonCompliances.some(
          (pnc: ParameterNonCompliance) => pnc.incongruity_id === nc.id
        )
      );
    } else {
      const response = await api.get("/all-cases-of-parameter-non-compliance", {
        params: { param_id },
      });
      return response.data;
    }
  },
};
