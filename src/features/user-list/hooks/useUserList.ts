import { useState } from "react";
import { ColDef, CellValueChangedEvent } from "ag-grid-community";

export const useUserList = () => {
  const [rowData, setRowData] = useState([
    {
      id: 1,
      name: "Иванов Иван",
      email: "ivanov@example.com",
      department: "IT",
      phone: "+79991234567",
      role: "Администратор",
      status: "На работе",
    },
    {
      id: 2,
      name: "Петров Петр",
      email: "petrov@example.com",
      department: "HR",
      phone: "+79997654321",
      role: "Оператор",
      status: "В отпуске",
    },
    {
      id: 3,
      name: "Сидоров Алексей",
      email: "sidorov@example.com",
      department: "HR",
      phone: "+79998887766",
      role: "Мастер",
      status: "Уволен",
    },
  ]);

  const currentUserRole = "Администратор"; // Заменить на реальную роль из контекста/состояния

  const isAdmin = [
    "Администратор",
    "Администратор общества",
    "Администратор филиала",
  ].includes(currentUserRole);

  const columnDefs: ColDef[] = [
    {
      headerName: "",
      field: "checkbox",
      checkboxSelection: true,
      headerCheckboxSelection: true,
      width: 50,
      hide: !isAdmin,
    },
    { headerName: "№", field: "id", width: 70 },
    {
      headerName: "ФИО / email",
      field: "name",
      valueGetter: (params) => `${params.data.name} / ${params.data.email}`,
    },
    { headerName: "Отдел", field: "department" },
    { headerName: "Телефон", field: "phone" },
    {
      headerName: "Права доступа",
      field: "role",
      editable: isAdmin,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: [
          "Администратор",
          "Администратор общества",
          "Администратор филиала",
          "Мастер",
          "Оператор",
          "Гость",
        ],
      },
    },
    {
      headerName: "Статус",
      field: "status",
      editable: isAdmin,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: [
          "На работе",
          "На больничном",
          "В командировке",
          "В отпуске",
          "Уволен",
        ],
      },
    },
    {
      headerName: "",
      field: "edit",
      cellRenderer: "editButtonRenderer",
      width: 100,
      hide: !isAdmin,
    },
  ];

  const onEditSave = (event: CellValueChangedEvent) => {
    const field = event.colDef.field;
    if (field && ["role", "status"].includes(field)) {
      const updatedData = rowData.map((row) =>
        row.id === event.data.id ? { ...row, [field]: event.newValue } : row
      );
      setRowData(updatedData);
    }
  };

  return { rowData, columnDefs, onEditSave };
};
