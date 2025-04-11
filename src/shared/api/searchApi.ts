import { api, testApi } from "./axios";
import { useAuthStore } from "@/features/auth/store";
import { User } from "@/entities/user";
import { Object } from "@/entities/object";
import { Task } from "@/entities/task";

interface SearchResult {
  user_search_result: User[];
  object_search_result: Object[];
  task_search_result: Task[];
}

export const searchApi = {
  search: async (query: string): Promise<SearchResult> => {
    const { isTestMode } = useAuthStore.getState();
    if (isTestMode) {
      const users = await testApi.get("/all-users-company/users");
      const objects = await testApi.get("/all-domain-objects");
      const tasks = await testApi.get("/tasks");
      return {
        user_search_result: users.data.filter(
          (u: User) =>
            u.full_name?.toLowerCase().includes(query.toLowerCase()) ||
            u.name.toLowerCase().includes(query.toLowerCase())
        ),
        object_search_result: objects.data.filter((o: Object) =>
          o.name.toLowerCase().includes(query.toLowerCase())
        ),
        task_search_result: tasks.data.filter(
          (t: Task) => t.date_time.toLowerCase().includes(query.toLowerCase()) // Ошибка устранена
        ),
      };
    } else {
      const response = await api.get("/search", { params: { query } });
      return response.data;
    }
  },
};
