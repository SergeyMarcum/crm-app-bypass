import api from "./axios";
import { z } from "zod";
import { taskSchema, tasksSchema } from "@/shared/lib/schemas";
import { handleApiError } from "@/shared/lib/errorHandler";

export const taskApi = {
  getTasks: async () => {
    try {
      const response = await api.get("/tasks");
      return tasksSchema.parse(response.data);
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  createTask: async (data: { title: string; description: string }) => {
    try {
      const response = await api.post("/tasks", data);
      return taskSchema.parse(response.data);
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
};
