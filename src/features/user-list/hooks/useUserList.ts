import React, { useState } from "react";
import {
  ColDef,
  CellValueChangedEvent,
  CellClassParams,
} from "ag-grid-community";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/store";
import { userApi } from "@/shared/api/userApi";
import { User } from "@/entities/user";

export const useUserList = () => {
  const { isTestMode, user, token } = useAuthStore();
  const [rowData, setRowData] = useState<User[]>([]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["users", user?.domain],
    queryFn: async () => {
      if (isTestMode) return mockUsers;
      if (user?.domain && user?.name && token) {
        const response = await userApi.getAllUsersWithParams(
          user.domain,
          user.name,
          token
        );
        return response.users;
      }
      return [];
    },
    enabled: !!user?.name && !!token && !!user?.domain,
  });

  React.useEffect(() => {
    if (isTestMode) {
      setRowData(mockUsers);
    } else if (data) {
      setRowData(data);
    } else if (!isLoading && !data) {
      setRowData([]);
    }
  }, [data, isTestMode, isLoading, error]);

  const currentUserRole = "Администратор";
  const isAdmin = [
    "Администратор ИТЦ",
    "Администратор Филиала",
    "Администратор Общества",
  ].includes(currentUserRole);

  const roleMap: Record<number, string> = {
    1: "Администратор ИТЦ",
    2: "Администратор Филиала",
    3: "Мастер",
    4: "Оператор",
    5: "Наблюдатель Филиала",
    6: "Гость",
    7: "Уволенные",
    8: "Администратор Общества",
  };

  const statusMap: Record<number, string> = {
    1: "Работает",
    2: "Уволен(а)",
    3: "Отпуск",
    4: "Командировка",
    5: "Больничный",
  };

  const columnDefs: ColDef<User>[] = [
    {
      headerName: "",
      checkboxSelection: true,
      headerCheckboxSelection: true,
      width: 50,
      hide: !isAdmin,
    },
    { headerName: "№", field: "id", width: 70 },
    {
      headerName: "ФИО / email",
      valueGetter: (params) =>
        `${params.data?.full_name || params.data?.name || "Не указано"} / ${
          params.data?.email || "Не указано"
        }`,
    },
    { headerName: "Отдел", field: "department" },
    { headerName: "Телефон", field: "phone" },
    {
      headerName: "Права доступа",
      field: "role_id",
      editable: isAdmin,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: Object.values(roleMap),
      },
      valueFormatter: (params) => roleMap[params.value] || "Не указано",
      cellStyle: (params: CellClassParams<User>) => ({
        backgroundColor:
          params.colDef.editable &&
          params.api
            .getEditingCells()
            .some(
              (cell) =>
                cell.column.getColId() === "role_id" &&
                cell.rowIndex === params.node.rowIndex
            )
            ? "#e0f7fa"
            : "",
      }),
    },
    {
      headerName: "Статус",
      field: "status_id",
      editable: isAdmin,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: Object.values(statusMap),
      },
      valueFormatter: (params) => statusMap[params.value] || "Не указано",
      cellStyle: (params: CellClassParams<User>) => ({
        backgroundColor:
          params.colDef.editable &&
          params.api
            .getEditingCells()
            .some(
              (cell) =>
                cell.column.getColId() === "status_id" &&
                cell.rowIndex === params.node.rowIndex
            )
            ? "#e0f7fa"
            : "",
      }),
    },
    {
      headerName: "",
      cellRenderer: "editButtonRenderer",
      width: 100,
      hide: !isAdmin,
    },
  ];

  const onEditSave = async (event: CellValueChangedEvent<User>) => {
    const field = event.colDef.field as keyof User;
    if (field && ["role_id", "status_id"].includes(field)) {
      const updatedData = rowData.map((row) =>
        row.id === event.data?.id ? { ...row, [field]: event.newValue } : row
      );
      setRowData(updatedData);

      if (!isTestMode && event.data?.id) {
        await userApi.editUser({
          user_id: event.data.id,
          [field]: event.newValue,
        });
      }
    }
  };

  return { rowData, columnDefs, onEditSave, isLoading, error };
};

const mockUsers: User[] = [
  {
    id: 1,
    full_name: "Иванов Иван",
    company: "ООО Тест",
    email: "ivanov@example.com",
    role_id: 1,
    status_id: 1,
    domain: "orenburg",
    position: "Инженер",
    name: "ivanov",
    department: "IT",
    phone: "+79991234567",
  },
  {
    id: 2,
    full_name: "Петров Петр",
    company: "ООО Тест",
    email: "petrov@example.com",
    role_id: 4,
    status_id: 3,
    domain: "orenburg",
    position: "Менеджер",
    name: "petrov",
    department: "HR",
    phone: "+79997654321",
  },
];
