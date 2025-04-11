import { api, testApi } from "./axios";
import { useAuthStore } from "@/features/auth/store";
import { Task } from "@/entities/task";

export const taskApi = {
  addTask: async (data: {
    user_id: number;
    object_id: number;
    shift_id: number;
    checking_type_id: number;
    date_time: string;
  }): Promise<void> => {
    const { isTestMode, domain } = useAuthStore.getState();
    if (isTestMode) {
      await testApi.post("/tasks", {
        id: Date.now().toString(),
        ...data,
        domain,
        status: "Не начато",
      });
    } else {
      await api.post("/add-new-task", data);
    }
  },
  editTask: async (
    id: number,
    data: {
      user_id: number;
      object_id: number;
      shift_id: number;
      checking_type_id: number;
      date_time: string;
    }
  ): Promise<void> => {
    const { isTestMode } = useAuthStore.getState();
    if (isTestMode) {
      await testApi.put(`/tasks/${id}`, data);
    } else {
      await api.put("/edit-task", { id, ...data });
    }
  },
  deleteTask: async (id: number): Promise<void> => {
    const { isTestMode } = useAuthStore.getState();
    if (isTestMode) {
      await testApi.delete(`/tasks/${id}`);
    } else {
      await api.delete("/delete-task", { data: { id } });
    }
  },
  getOperatorTasks: async (id: number): Promise<Task[]> => {
    const { isTestMode } = useAuthStore.getState();
    const response = isTestMode
      ? await testApi.get("/tasks")
      : await api.get("/operator-tasks", { params: { id } });
    return response.data.filter((task: Task) => task.user_id === id); // Ошибка устранена
  },
  getObjectTasks: async (id: number): Promise<Task[]> => {
    const { isTestMode } = useAuthStore.getState();
    const response = isTestMode
      ? await testApi.get("/tasks")
      : await api.get("/object-tasks", { params: { id } });
    return response.data.filter((task: Task) => task.object_id === id); // Ошибка устранена
  },
  getDomainTasks: async (): Promise<Task[]> => {
    const { isTestMode, domain } = useAuthStore.getState();
    const response = isTestMode
      ? await testApi.get("/tasks")
      : await api.get("/domain-tasks");
    return response.data.filter((task: Task) => task.domain === domain); // Ошибка устранена
  },
  getAllTasks: async (): Promise<Task[]> => {
    const { isTestMode } = useAuthStore.getState();
    const response = isTestMode
      ? await testApi.get("/tasks")
      : await api.get("/all-tasks");
    return response.data;
  },
  generateXmlTask: async (id: number): Promise<string> => {
    const { isTestMode } = useAuthStore.getState();
    if (isTestMode) {
      const response = await testApi.get(`/tasks/${id}`);
      return `<task><id>${response.data.id}</id><user_id>${response.data.user_id}</user_id><object_id>${response.data.object_id}</object_id></task>`;
    } else {
      const response = await api.get("/generate-xml-task", {
        params: { id },
        responseType: "text",
      });
      return response.data;
    }
  },
};
