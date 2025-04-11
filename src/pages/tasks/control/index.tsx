// src/pages/tasks/control/index.tsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Stack,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Avatar,
  IconButton,
  TablePagination,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/store";
import { Link as RouterLink } from "react-router-dom";
import EastIcon from "@mui/icons-material/East";
import FilterListIcon from "@mui/icons-material/FilterList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ViewListIcon from "@mui/icons-material/ViewList";
import dayjs, { Dayjs } from "dayjs";

// Интерфейсы
interface User {
  id: string;
  full_name: string;
  email: string;
}

interface DomainObject {
  id: string;
  name: string;
}

interface Task {
  id: string;
  date_time: string;
  user_id: string;
  object_id: string;
  status: string;
  domain: string;
  user?: User;
  object?: DomainObject;
}

// Список статусов
const statusMap: Record<
  string,
  { label: string; color: "success" | "warning" | "error" }
> = {
  Выполнено: { label: "Выполнено", color: "success" },
  "В процессе": { label: "В процессе", color: "warning" },
  "Не начато": { label: "Не начато", color: "error" },
};

// Получение данных из JSON-сервера
const fetchTasks = async (domain: string): Promise<Task[]> => {
  const response = await fetch(`http://localhost:3001/tasks?domain=${domain}`);
  if (!response.ok) throw new Error("Ошибка загрузки задач");
  return response.json();
};

const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch(`http://localhost:3001/all-users-company`);
  if (!response.ok) throw new Error("Ошибка загрузки пользователей");
  return response.json();
};

const fetchObjects = async (): Promise<DomainObject[]> => {
  const response = await fetch(`http://localhost:3001/all-domain-objects`);
  if (!response.ok) throw new Error("Ошибка загрузки объектов");
  return response.json();
};

const TaskControlPage: React.FC = () => {
  const { user, isTestMode } = useAuthStore();
  const [searchObject, setSearchObject] = useState("");
  const [searchOperator, setSearchOperator] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<Dayjs | null>(null);
  const [dateTo, setDateTo] = useState<Dayjs | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [viewMode, setViewMode] = useState<"list" | "group">("list");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const queryClient = useQueryClient();

  // Загрузка данных
  const { data: tasks = [], isLoading: isTasksLoading } = useQuery({
    queryKey: ["tasks", user?.domain],
    queryFn: () => fetchTasks(user?.domain || "orenburg"),
    enabled: isTestMode,
  });

  const { data: users = [], isLoading: isUsersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    enabled: isTestMode,
  });

  const { data: objects = [], isLoading: isObjectsLoading } = useQuery({
    queryKey: ["objects"],
    queryFn: fetchObjects,
    enabled: isTestMode,
  });

  // Объединяем данные
  const enrichedTasks = tasks.map((task) => {
    const taskUser = users.find((u) => u.id === task.user_id);
    const taskObject = objects.find((o) => o.id === task.object_id);
    return {
      ...task,
      user: taskUser
        ? {
            id: taskUser.id,
            full_name: taskUser.full_name,
            email: taskUser.email,
          }
        : undefined,
      object: taskObject
        ? { id: taskObject.id, name: taskObject.name }
        : undefined,
    };
  });

  // Фильтрация и сортировка задач
  const filteredTasks = enrichedTasks
    .filter((task) =>
      searchObject && task.object
        ? task.object.name.toLowerCase().includes(searchObject.toLowerCase())
        : true
    )
    .filter((task) =>
      searchOperator && task.user
        ? task.user.full_name
            .toLowerCase()
            .includes(searchOperator.toLowerCase())
        : true
    )
    .filter((task) =>
      statusFilter === "all" ? true : task.status === statusFilter
    )
    .filter((task) => {
      if (!dateFrom && !dateTo) return true;
      const taskDate = dayjs(task.date_time);
      if (dateFrom && taskDate.isBefore(dateFrom, "day")) return false;
      if (dateTo && taskDate.isAfter(dateTo, "day")) return false;
      return true;
    })
    .sort((a, b) =>
      sortOrder === "desc"
        ? parseInt(b.id) - parseInt(a.id)
        : parseInt(a.id) - parseInt(b.id)
    );

  // Группировка по статусу
  const groupedTasks = Object.entries(statusMap)
    .map(([status, { label }]) => ({
      status: label,
      tasks: filteredTasks.filter((task) => task.status === status),
    }))
    .filter((group) => group.tasks.length > 0);

  const paginatedTasks = filteredTasks.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewModeChange = (
    _: React.MouseEvent<HTMLElement>,
    newViewMode: "list" | "group"
  ) => {
    if (newViewMode) setViewMode(newViewMode);
  };

  const applyFilters = () => {
    queryClient.invalidateQueries({ queryKey: ["tasks", user?.domain] });
  };

  const getStatusChip = (status: string) => {
    const { label, color } = statusMap[status] || {
      label: "Неизвестно",
      color: "default",
    };
    return <Chip label={label} color={color} size="small" />;
  };

  if (!isTestMode) {
    return <Typography>Страница доступна только в тестовом режиме</Typography>;
  }

  if (isTasksLoading || isUsersLoading || isObjectsLoading) {
    return <Typography>Загрузка...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Box>
          <Typography variant="h4">Контроль заданий</Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Список заданий по проверке объектов филиала
          </Typography>
        </Box>
      </Stack>

      <Stack direction="row" spacing={4}>
        {/* Фильтры */}
        <Paper elevation={1} sx={{ p: 3, width: 300, borderRadius: 2 }}>
          <Typography variant="h5" mb={2}>
            Фильтры
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="Поиск по объекту"
              value={searchObject}
              onChange={(e) => setSearchObject(e.target.value)}
              fullWidth
            />
            <TextField
              label="Поиск по оператору"
              value={searchOperator}
              onChange={(e) => setSearchOperator(e.target.value)}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Статус</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Статус"
              >
                <MenuItem value="all">Все</MenuItem>
                {Object.keys(statusMap).map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Дата проверки (с)"
                value={dateFrom}
                onChange={(newValue) => setDateFrom(newValue)}
                slotProps={{
                  textField: { fullWidth: true },
                }}
              />
              <DatePicker
                label="Дата проверки (по)"
                value={dateTo}
                onChange={(newValue) => setDateTo(newValue)}
                slotProps={{
                  textField: { fullWidth: true },
                }}
              />
            </LocalizationProvider>
            <Button
              variant="contained"
              color="primary"
              onClick={applyFilters}
              disabled={
                !searchObject &&
                !searchOperator &&
                statusFilter === "all" &&
                !dateFrom &&
                !dateTo
              }
            >
              Применить
            </Button>
          </Stack>
        </Paper>

        {/* Таблица */}
        <Box flex={1}>
          <Stack direction="row" spacing={2} mb={2} alignItems="center">
            <Button
              variant="text"
              color="secondary"
              startIcon={<FilterListIcon />}
              onClick={() => {}}
            >
              Фильтры
            </Button>
            <FormControl sx={{ minWidth: 120 }}>
              <Select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
              >
                <MenuItem value="desc">Сначала новые записи</MenuItem>
                <MenuItem value="asc">Сначала старые записи</MenuItem>
              </Select>
            </FormControl>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={handleViewModeChange}
              aria-label="view mode"
            >
              <ToggleButton value="group" aria-label="group view">
                <ViewModuleIcon />
              </ToggleButton>
              <ToggleButton value="list" aria-label="list view">
                <ViewListIcon />
              </ToggleButton>
            </ToggleButtonGroup>
          </Stack>

          {viewMode === "list" ? (
            <Paper elevation={1} sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>№</TableCell>
                    <TableCell>Дата проверки</TableCell>
                    <TableCell>Наименование объекта</TableCell>
                    <TableCell>Оператор</TableCell>
                    <TableCell>Статус</TableCell>
                    <TableCell>Действия</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedTasks.map((task, index) => (
                    <TableRow key={task.id}>
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">
                          {dayjs(task.date_time).format("MMM D, YYYY")}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">
                          {task.object?.name || "Неизвестный объект"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Avatar
                            src={`/assets/avatar-${(parseInt(task.user_id) % 5) + 1}.png`}
                            sx={{ width: 32, height: 32 }}
                          />
                          <Box>
                            <Typography variant="subtitle2">
                              {task.user?.full_name || "Неизвестный оператор"}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {task.user?.email || "Нет email"}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>{getStatusChip(task.status)}</TableCell>
                      <TableCell>
                        <IconButton
                          component={RouterLink}
                          to={`/tasks/control/${task.id}`}
                          color="secondary"
                        >
                          <EastIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredTasks.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          ) : (
            groupedTasks.map((group) => (
              <Stack key={group.status} spacing={1} mb={3}>
                <Typography variant="h6">{`${group.status} (${group.tasks.length})`}</Typography>
                <Paper elevation={1} sx={{ borderRadius: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>№</TableCell>
                        <TableCell>Дата проверки</TableCell>
                        <TableCell>Наименование объекта</TableCell>
                        <TableCell>Оператор</TableCell>
                        <TableCell>Статус</TableCell>
                        <TableCell>Действия</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {group.tasks.map((task, index) => (
                        <TableRow key={task.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>
                            <Typography variant="subtitle2">
                              {dayjs(task.date_time).format("MMM D, YYYY")}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="subtitle2">
                              {task.object?.name || "Неизвестный объект"}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={1}
                            >
                              <Avatar
                                src={`/assets/avatar-${(parseInt(task.user_id) % 5) + 1}.png`}
                                sx={{ width: 32, height: 32 }}
                              />
                              <Box>
                                <Typography variant="subtitle2">
                                  {task.user?.full_name ||
                                    "Неизвестный оператор"}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {task.user?.email || "Нет email"}
                                </Typography>
                              </Box>
                            </Stack>
                          </TableCell>
                          <TableCell>{getStatusChip(task.status)}</TableCell>
                          <TableCell>
                            <IconButton
                              component={RouterLink}
                              to={`/tasks/control/${task.id}`}
                              color="secondary"
                            >
                              <EastIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Paper>
              </Stack>
            ))
          )}
        </Box>
      </Stack>
    </Box>
  );
};

export default TaskControlPage;
