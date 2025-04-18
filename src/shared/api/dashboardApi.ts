import api from "./axios";
import { z } from "zod";
import { dashboardStatsSchema } from "@/shared/lib/schemas";
import { handleApiError } from "@/shared/lib/errorHandler";

export const dashboardApi = {
  getStats: async () => {
    try {
      const response = await api.get("/dashboard");
      return dashboardStatsSchema.parse(response.data);
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
};
