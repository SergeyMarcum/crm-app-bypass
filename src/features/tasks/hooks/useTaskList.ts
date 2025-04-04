import { useEffect, useState } from "react";
import { ColDef, CellValueChangedEvent } from "ag-grid-community";
import { useAuthStore } from "../../auth/store";
import { useQuery } from "@tanstack/react-query";
import { taskApi } from "../../../shared/api/taskApi";

// Интерфейс Task для useTaskList
interface Task {
  id: number;
  checkDate: string;
  objectName: string;
  operatorName: string;
  status: "Не начато" | "В процессе" | "Выполнено";
}

// Моковые данные для тестового режима
const mockTasks: Task[] = [
  {
    id: 1,
    checkDate: "2025-04-05",
    objectName: "Объект 1",
    operatorName: "Иванов И.И.",
    status: "Не начато",
  },
  {
    id: 2,
    checkDate: "2025-04-06",
    objectName: "Объект 2",
    operatorName: "Петров П.П.",
    status: "В процессе",
  },
  {
    id: 3,
    checkDate: "2025-04-07",
    objectName: "Объект 3",
    operatorName: "Сидоров А.А.",
    status: "Выполнено",
  },
];

export const useTaskList = () => {
  const { isTestMode } = useAuthStore();

  // Загрузка данных через useQuery
  const { data: apiTasks, isLoading } = useQuery<Task[]>({
    queryKey: ["taskList"],
    queryFn: async () => {
      const response = await taskApi.getTaskList(); // Предполагаем, что API возвращает данные совместимые с Task из useTask
      // Адаптируем данные из API к интерфейсу Task в useTaskList
      return response.map((task) => ({
        id: Number(task.id),
        checkDate: task.startDate.split("T")[0], // Пример адаптации
        objectName: task.object.name,
        operatorName: task.operator.fullName,
        status: task.status,
      }));
    },
    enabled: !isTestMode, // Загружаем только если не в тестовом режиме
  });

  const [rowData, setRowData] = useState<Task[]>(isTestMode ? mockTasks : []);

  const currentUserRole = "Администратор"; // Заменить на реальную роль из контекста/состояния
  const isAdmin = [
    "Администратор",
    "Администратор общества",
    "Администратор филиала",
  ].includes(currentUserRole);

  const columnDefs: ColDef<Task>[] = [
    {
      headerName: "",
      checkboxSelection: true,
      headerCheckboxSelection: true,
      width: 50,
      hide: !isAdmin,
    },
    { headerName: "№", field: "id", width: 70 },
    { headerName: "Дата проверки", field: "checkDate" },
    { headerName: "Наименование объекта", field: "objectName" },
    { headerName: "Оператор", field: "operatorName" },
    {
      headerName: "Статус",
      field: "status",
      editable: isAdmin,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: ["Не начато", "В процессе", "Выполнено"],
      },
    },
    {
      headerName: "",
      cellRenderer: "editButtonRenderer",
      width: 100,
      hide: !isAdmin,
    },
  ];

  const onEditSave = (event: CellValueChangedEvent<Task>) => {
    const field = event.colDef.field;
    if (field === "status") {
      const updatedData = rowData.map((row) =>
        row.id === event.data?.id ? { ...row, [field]: event.newValue } : row
      );
      setRowData(updatedData);
      if (!isTestMode && event.data?.id) {
        taskApi.updateTaskStatus(event.data.id, event.newValue as string);
      }
    }
  };

  // Обновляем rowData при получении реальных данных
  useEffect(() => {
    if (!isTestMode && apiTasks) {
      setRowData(apiTasks);
    }
  }, [apiTasks, isTestMode]);

  return { rowData, columnDefs, onEditSave, isLoading };
};
