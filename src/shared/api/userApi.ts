// src/shared/api/userApi.ts

import api from "./axios";
import { z } from "zod";
import { userSchema, usersSchema } from "@/shared/lib/schemas";
import { handleApiError } from "@/shared/lib/errorHandler";

export const userApi = {
  getUsers: async () => {
    try {
      const response = await api.get("/users");
      return usersSchema.parse(response.data);
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  getAllUsersCompany: async () => {
    try {
      const response = await api.get("/all-users-company");
      return usersSchema.parse(response.data);
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  makeMainAdmin: async (userId: number) => {
    try {
      const response = await api.post("/make-main-admin", { user_id: userId });
      return userSchema.parse(response.data);
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  makeOperator: async (userId: number) => {
    try {
      const response = await api.post("/make-operator", { user_id: userId });
      return userSchema.parse(response.data);
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
};
