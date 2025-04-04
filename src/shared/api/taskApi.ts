import axios from "axios";
import { Task } from "../../features/tasks/hooks/useTask";

export const taskApi = {
  getTask: async (taskId: string): Promise<Task> => {
    const response = await axios.get(`/api/tasks/${taskId}`);
    return response.data;
  },
};
