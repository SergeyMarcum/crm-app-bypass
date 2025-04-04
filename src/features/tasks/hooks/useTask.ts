import { useQuery } from "@tanstack/react-query";
import { taskApi } from "../../../shared/api/taskApi";
import { useAuthStore } from "../../auth/store";

export interface Task {
  id: string;
  startDate: string;
  reportDate?: string;
  isRecheck: boolean;
  lastCheckDate?: string;
  status: "Выполнено" | "В процессе" | "Не начато";
  object: {
    name: string;
    address: string;
    fullName: string;
    characteristics: string;
  };
  operator: {
    avatar: string;
    fullName: string;
    position: string;
    department: string;
    email: string;
    phone: string;
  };
  parameters: {
    id: string;
    name: string;
    isCompliant: boolean;
  }[];
}

const mockTask: Task = {
  id: "1",
  startDate: "2025-04-05T10:00:00",
  reportDate: "2025-04-05T12:00:00",
  isRecheck: false,
  lastCheckDate: undefined,
  status: "Выполнено",
  object: {
    name: "Объект 1",
    address: "г. Москва, ул. Примерная, д. 1",
    fullName: "ООО Примерный объект",
    characteristics: "Котельная, построена в 2020",
  },
  operator: {
    avatar: "/assets/avatar.png",
    fullName: "Иванов И.И.",
    position: "Инженер",
    department: "Отдел проверок",
    email: "ivanov@example.com",
    phone: "+79991234567",
  },
  parameters: [
    { id: "1", name: "Параметр 1", isCompliant: true },
    { id: "2", name: "Параметр 2", isCompliant: false },
  ],
};

export const useTask = (taskId?: string) => {
  const { isTestMode } = useAuthStore();

  const { data, isLoading } = useQuery<Task>({
    queryKey: ["task", taskId],
    queryFn: () => taskApi.getTask(taskId!),
    enabled: !!taskId && !isTestMode,
  });

  return {
    task: isTestMode ? mockTask : data,
    loading: isTestMode ? false : isLoading,
  };
};
