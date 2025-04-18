import api from "./axios";
import { z } from "zod";
import { userSchema } from "@/shared/lib/schemas";
import { handleApiError } from "@/shared/lib/errorHandler";

// Типы входных данных для логина
const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
  domain: z.string().min(1),
});

export type LoginData = z.infer<typeof loginSchema>;

export const authApi = {
  login: async (data: LoginData) => {
    try {
      const validatedData = loginSchema.parse(data);
      const response = await api.get("/login", { params: validatedData });
      return userSchema.parse(response.data);
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await api.get("/logout");
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  checkSession: async () => {
    try {
      const response = await api.get("/check-session");
      return userSchema.parse(response.data);
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
};
