import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import { useTaskList } from "../../../features/tasks/hooks/useTaskList";
import { EditButtonRenderer } from "../../../features/user-list/components/EditButtonRenderer";
import { ModuleRegistry } from "ag-grid-community";
import { ClientSideRowModelModule } from "ag-grid-community";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const TaskControlPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { rowData, columnDefs, onEditSave, isLoading } = useTaskList();

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  const filteredData = rowData
    .filter((task) =>
      search
        ? task.objectName.toLowerCase().includes(search.toLowerCase())
        : true
    )
    .filter((task) =>
      statusFilter === "all" ? true : task.status === statusFilter
    );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">Контроль заданий</Typography>
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Список заданий по проверке объектов филиала
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          label="Поиск по объекту"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flex: 1 }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Статус</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            label="Статус"
          >
            <MenuItem value="all">Все</MenuItem>
            <MenuItem value="Не начато">Не начато</MenuItem>
            <MenuItem value="В процессе">В процессе</MenuItem>
            <MenuItem value="Выполнено">Выполнено</MenuItem>
          </Select>
        </FormControl>
      </Box>

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
        Всего заданий: {filteredData.length}
      </Typography>
    </Box>
  );
};

export default TaskControlPage;
