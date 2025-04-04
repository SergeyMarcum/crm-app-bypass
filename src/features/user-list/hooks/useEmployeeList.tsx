import { useState } from "react";
import {
  ColDef,
  CellValueChangedEvent,
  ICellRendererParams,
} from "ag-grid-community";
import { Link } from "react-router-dom";

// Определяем тип данных для сотрудника
interface Employee {
  id: number;
  name: string;
  position: string;
  email: string;
  department: string;
  phone: string;
  address: string;
  status: string;
  path: string[];
}

export const useEmployeeList = () => {
  const [rowData, setRowData] = useState<Employee[]>([
    {
      id: 1,
      name: "Иванов Иван Иванович",
      position: "Начальник отдела №1",
      email: "ivanov@mail.ru",
      department: "Отдел №1",
      phone: "+79996567575",
      address: "г. Москва, ул. Рязанская, д. 123",
      status: "В отпуске",
      path: ["Название филиала", "Отдел №1"],
    },
    {
      id: 2,
      name: "Петров Иван Иванович",
      position: "Заместитель начальника отдела №1",
      email: "petrov@mail.ru",
      department: "Отдел №1",
      phone: "+79996567576",
      address: "г. Москва, ул. Рязанская, д. 123",
      status: "На работе",
      path: ["Название филиала", "Отдел №1"],
    },
    {
      id: 3,
      name: "Сидоров Иван Иванович",
      position: "Инженер",
      email: "sidorov@mail.ru",
      department: "Отдел №1",
      phone: "+79996567576",
      address: "г. Москва, ул. Рязанская, д. 123",
      status: "На работе",
      path: ["Название филиала", "Отдел №1"],
    },
    {
      id: 4,
      name: "Кооп Иван Иванович",
      position: "Начальник отдела №2",
      email: "koop@mail.ru",
      department: "Отдел №2",
      phone: "+79996567575",
      address: "г. Москва, ул. Рязанская, д. 123",
      status: "На работе",
      path: ["Название филиала", "Отдел №2"],
    },
    {
      id: 5,
      name: "Кан Иван Иванович",
      position: "Заместитель начальника отдела №2",
      email: "kan@mail.ru",
      department: "Отдел №2",
      phone: "+79996567576",
      address: "г. Москва, ул. Рязанская, д. 123",
      status: "На работе",
      path: ["Название филиала", "Отдел №2"],
    },
    {
      id: 6,
      name: "Ким Иван Иванович",
      position: "Инженер",
      email: "kim@mail.ru",
      department: "Отдел №2",
      phone: "+79996567576",
      address: "г. Москва, ул. Рязанская, д. 123",
      status: "На работе",
      path: ["Название филиала", "Отдел №2"],
    },
  ]);

  const currentUserRole = "Администратор"; // Заменить на реальную роль из контекста/состояния

  const isAdmin = [
    "Администратор",
    "Администратор общества",
    "Администратор филиала",
  ].includes(currentUserRole);

  const columnDefs: ColDef<Employee>[] = [
    {
      headerName: "",
      checkboxSelection: true,
      headerCheckboxSelection: true,
      width: 50,
      hide: !isAdmin,
    },
    { headerName: "№", field: "id", width: 70 },
    {
      headerName: "ФИО / Должность",
      field: "name",
      cellRenderer: (params: ICellRendererParams<Employee>) => (
        <Link
          to={`/employees/${params.data?.id}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          {params.data?.name} <br /> {params.data?.position}
        </Link>
      ),
    },
    { headerName: "Отдел", field: "department" },
    { headerName: "Email", field: "email" },
    { headerName: "Телефон", field: "phone" },
    { headerName: "Адрес", field: "address" },
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
      cellRenderer: "editButtonRenderer",
      width: 100,
      hide: !isAdmin,
    },
  ];

  const onEditSave = (event: CellValueChangedEvent<Employee>) => {
    const field = event.colDef.field;
    if (field === "status") {
      const updatedData = rowData.map((row) =>
        row.id === event.data?.id ? { ...row, [field]: event.newValue } : row
      );
      setRowData(updatedData);
    }
  };

  return { rowData, columnDefs, onEditSave };
};
