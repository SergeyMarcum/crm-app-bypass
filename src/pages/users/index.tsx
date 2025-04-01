import React, { useState, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Button,
  Select,
  MenuItem,
  Modal,
  TextField,
} from "@mui/material";
import { useUserList } from "../../features/user-list/hooks/useUserList";
import { EditButtonRenderer } from "../../features/user-list/components/EditButtonRenderer";
import { ModuleRegistry } from "ag-grid-community";
import { ClientSideRowModelModule } from "ag-grid-community";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const UsersPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [filterModal, setFilterModal] = useState<string | null>(null);
  const [filterValues, setFilterValues] = useState({
    email: "",
    department: "",
    phone: "",
  });
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { rowData, columnDefs, onEditSave } = useUserList();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const openFilterModal = (type: string) => {
    // Если фильтр уже активен, сбрасываем его при повторном нажатии
    if (filterValues[type as keyof typeof filterValues]) {
      setFilterValues({ ...filterValues, [type]: "" });
    } else {
      setFilterModal(type);
    }
  };

  const closeFilterModal = () => setFilterModal(null);

  const applyFilter = useCallback(() => {
    closeFilterModal();
  }, [filterValues]);

  const filteredData = rowData
    .filter((row) => {
      switch (tabValue) {
        case 0:
          return true; // Все
        case 1:
          return row.status === "На работе";
        case 2:
          return row.status === "На больничном";
        case 3:
          return row.status === "В командировке";
        case 4:
          return row.status === "В отпуске";
        case 5:
          return row.status === "Уволен";
        default:
          return true;
      }
    })
    .filter((row) =>
      filterValues.email ? row.email.includes(filterValues.email) : true
    )
    .filter((row) =>
      filterValues.department
        ? row.department.includes(filterValues.department)
        : true
    )
    .filter((row) =>
      filterValues.phone ? row.phone.includes(filterValues.phone) : true
    )
    .sort((a, b) => (sortOrder === "desc" ? b.id - a.id : a.id - b.id));

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">Список пользователей</Typography>
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Информация по пользователям данного филиала
      </Typography>

      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label="Все" />
        <Tab label="На работе" />
        <Tab label="На больничном" />
        <Tab label="В командировке" />
        <Tab label="В отпуске" />
        <Tab label="Уволены" />
      </Tabs>

      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Button
          variant={filterValues.email ? "contained" : "outlined"}
          color={filterValues.email ? "primary" : "inherit"}
          onClick={() => openFilterModal("email")}
        >
          Email
        </Button>
        <Button
          variant={filterValues.department ? "contained" : "outlined"}
          color={filterValues.department ? "primary" : "inherit"}
          onClick={() => openFilterModal("department")}
        >
          Отдел
        </Button>
        <Button
          variant={filterValues.phone ? "contained" : "outlined"}
          color={filterValues.phone ? "primary" : "inherit"}
          onClick={() => openFilterModal("phone")}
        >
          Телефон
        </Button>
        <Select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
        >
          <MenuItem value="desc">Сначала новые записи</MenuItem>
          <MenuItem value="asc">Сначала старые записи</MenuItem>
        </Select>
      </Box>

      <Modal open={!!filterModal} onClose={closeFilterModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "white",
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6">Фильтр по {filterModal}</Typography>
          {filterModal === "department" ? (
            <Select
              fullWidth
              value={filterValues.department}
              onChange={(e) =>
                setFilterValues({ ...filterValues, department: e.target.value })
              }
              sx={{ mt: 2 }}
            >
              <MenuItem value="">Все отделы</MenuItem>
              <MenuItem value="IT">IT</MenuItem>
              <MenuItem value="HR">HR</MenuItem>
              {/* Добавь другие отделы */}
            </Select>
          ) : (
            <TextField
              fullWidth
              label={filterModal}
              value={
                filterModal === "email"
                  ? filterValues.email
                  : filterValues.phone
              }
              onChange={(e) =>
                setFilterValues({
                  ...filterValues,
                  [filterModal!]: e.target.value,
                })
              }
              sx={{ mt: 2 }}
            />
          )}
          <Button variant="contained" onClick={applyFilter} sx={{ mt: 2 }}>
            Применить
          </Button>
        </Box>
      </Modal>

      <div className="ag-theme-alpine" style={{ height: 500, width: "100%" }}>
        <AgGridReact
          rowData={filteredData}
          columnDefs={columnDefs}
          pagination={true}
          paginationPageSize={10}
          rowSelection="multiple"
          components={{ editButtonRenderer: EditButtonRenderer }}
          onCellValueChanged={onEditSave}
          suppressRowClickSelection={true}
        />
      </div>
      <Typography variant="body2" sx={{ mt: 1 }}>
        Всего записей: {filteredData.length}
      </Typography>
    </Box>
  );
};

export default UsersPage;
