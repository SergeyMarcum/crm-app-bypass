import axios from "axios";
import { Task as DetailedTask } from "../../features/tasks/hooks/useTask";

export const taskApi = {
  getTask: async (taskId: string): Promise<DetailedTask> => {
    const response = await axios.get(`/api/tasks/${taskId}`);
    return response.data;
  },
  getTaskList: async (): Promise<DetailedTask[]> => {
    const response = await axios.get("/api/tasks");
    return response.data;
  },
  updateTaskStatus: async (taskId: number, status: string): Promise<void> => {
    await axios.patch(`/api/tasks/${taskId}`, { status });
  },
};
