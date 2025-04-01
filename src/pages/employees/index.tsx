// src/pages/employees/index.tsx
import React, { useState, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import {
  Box,
  Tabs,
  Tab,
  Button,
  Select,
  MenuItem,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { EditButtonRenderer } from "../../features/user-list/components/EditButtonRenderer";
import { useUserList } from "../../features/user-list/hooks/useUserList";
import {
  ColDef,
  ICellRendererParams,
  ICellRendererComp,
} from "ag-grid-community";

// Тип для данных сотрудника, совместимый с данными из useUserList
interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  phone: string;
  role: string;
  status: string;
  fullName: string;
  position: string;
  address: string;
  path: string[];
}

const EmployeesPage: React.FC = () => {
  const [tabValue, setTabValue] = useState<string>("all");
  const [filterModal, setFilterModal] = useState<
    "email" | "department" | "phone" | null
  >(null);
  const [filterValue, setFilterValue] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  // Используем хук useUserList, где rowData — массив пользователей
  const { rowData, loading, error } = useUserList();

  // Адаптируем данные пользователей под структуру сотрудников
  const employees: Employee[] = useMemo(() => {
    return rowData.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      department: user.department,
      phone: user.phone,
      role: user.role,
      status: user.status,
      fullName: user.name, // Дублируем для совместимости с колонкой
      position: user.role, // Используем role как position
      address: "г. Москва, ул. Рязанская, д. 123", // Заглушка
      path: ["Название филиала", user.department], // Иерархия
    }));
  }, [rowData]);

  const columnDefs: ColDef<Employee>[] = useMemo(
    () => [
      {
        field: "checkbox",
        headerName: "",
        checkboxSelection: true,
        width: 50,
        hide: ![
          "Администратор",
          "Администратор общества",
          "Администратор филиала",
        ].includes(localStorage.getItem("userRole") || ""),
      },
      { field: "id", headerName: "№", width: 70 },
      {
        field: "fullName",
        headerName: "ФИО сотрудника",
        cellRenderer: (params: ICellRendererParams<Employee>) => (
          <Box>
            <a
              href={`/profile/${params.data?.id}`}
              style={{ textDecoration: "none", color: "#1976d2" }}
            >
              {params.value}
            </a>
            <Typography variant="caption" display="block">
              {params.data?.position}
            </Typography>
          </Box>
        ),
        width: 250,
      },
      { field: "department", headerName: "Отдел", width: 150 },
      { field: "email", headerName: "Email", width: 200 },
      { field: "phone", headerName: "Телефон", width: 150 },
      { field: "address", headerName: "Адрес", width: 250 },
      { field: "status", headerName: "Статус", width: 150 },
      {
        field: "edit",
        headerName: "",
        cellRenderer: "editButtonRenderer",
        cellRendererParams: {
          onEdit: (data: Employee) => {
            console.log("Edit employee:", data);
            // Здесь можно добавить логику обновления через API
          },
        },
        width: 100,
        hide: ![
          "Администратор",
          "Администратор общества",
          "Администратор филиала",
        ].includes(localStorage.getItem("userRole") || ""),
      },
    ],
    []
  );

  const rowDataMemo: Employee[] = useMemo(() => {
    let filteredData = [...employees];
    if (tabValue !== "all") {
      filteredData = filteredData.filter(
        (emp: Employee) => emp.status.toLowerCase() === tabValue
      );
    }
    if (filterModal && filterValue) {
      filteredData = filteredData.filter((emp: Employee) =>
        emp[filterModal]?.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    return filteredData.sort((a: Employee, b: Employee) =>
      sortOrder === "newest" ? b.id - a.id : a.id - b.id
    );
  }, [employees, tabValue, filterModal, filterValue, sortOrder]);

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
    }),
    []
  );

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  const openFilterModal = (type: "email" | "department" | "phone") =>
    setFilterModal(type);
  const closeFilterModal = () => {
    setFilterModal(null);
    setFilterValue("");
  };

  const applyFilter = () => {
    closeFilterModal();
  };

  const frameworkComponents: {
    [key: string]: React.FC<ICellRendererParams<Employee>>;
  } = {
    editButtonRenderer: EditButtonRenderer,
  };

  if (loading) return <Typography>Загрузка...</Typography>;
  if (error) return <Typography>Ошибка: {error}</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Список сотрудников
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Информация по сотрудникам данного филиала
      </Typography>

      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label="Все" value="all" />
        <Tab label="На работе" value="работает" />
        <Tab label="На больничном" value="на больничном" />
        <Tab label="В командировке" value="в командировке" />
        <Tab label="В отпуске" value="отпуск" />
        <Tab label="Уволены" value="уволен" />
      </Tabs>

      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Button variant="outlined" onClick={() => openFilterModal("email")}>
          Email
        </Button>
        <Button
          variant="outlined"
          onClick={() => openFilterModal("department")}
        >
          Отдел
        </Button>
        <Button variant="outlined" onClick={() => openFilterModal("phone")}>
          Телефон
        </Button>
        <Select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}
          size="small"
        >
          <MenuItem value="newest">Сначала новые</MenuItem>
          <MenuItem value="oldest">Сначала старые</MenuItem>
        </Select>
      </Box>

      <div className="ag-theme-material" style={{ height: 600, width: "100%" }}>
        <AgGridReact<Employee>
          columnDefs={columnDefs}
          rowData={rowDataMemo}
          defaultColDef={defaultColDef}
          frameworkComponents={frameworkComponents}
          treeData={true}
          getDataPath={(data: Employee) => data.path}
          autoGroupColumnDef={{
            headerName: "Структура",
            minWidth: 300,
            cellRendererParams: { suppressCount: true },
          }}
          pagination={true}
          paginationPageSize={10}
        />
      </div>

      <Modal open={!!filterModal} onClose={closeFilterModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            p: 4,
            minWidth: 300,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Фильтр по {filterModal}
          </Typography>
          <TextField
            fullWidth
            label={filterModal}
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" onClick={applyFilter}>
            Применить
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default EmployeesPage;
