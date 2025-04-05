import axios from "axios";
import { User, UserResponse } from "../../entities/user";

export const userApi = {
  getAllUsers: async (
    domain: string,
    username: string,
    sessionCode: string
  ): Promise<UserResponse> => {
    const response = await axios.get("/all-users-company", {
      params: { domain, username, session_code: sessionCode },
    });
    return response.data;
  },
  editUser: async (userId: number, updates: Partial<User>): Promise<void> => {
    await axios.put("/edit-user", {
      id: userId,
      ...updates,
    });
  },
};
