// src/pages/employees/index.tsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  Modal,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  IconButton,
  TablePagination,
  Chip,
  Stack,
  Avatar,
  Link,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import CancelIcon from "@mui/icons-material/Cancel";
import EmailIcon from "@mui/icons-material/Email";
import GroupIcon from "@mui/icons-material/Group";
import CallIcon from "@mui/icons-material/Call";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/store";
import { User } from "@/entities/user";
import { Link as RouterLink } from "react-router-dom";

// Список статусов и их соответствие status_id
const statusMap: Record<number, string> = {
  1: "На работе",
  2: "На больничном",
  3: "В командировке",
  4: "В отпуске",
  5: "Уволен",
};

// Получение сотрудников из JSON-сервера
const fetchEmployees = async (domain: string): Promise<User[]> => {
  const response = await fetch(
    `http://localhost:3001/all-users-company?domain=${domain}`
  );
  if (!response.ok) throw new Error("Ошибка загрузки сотрудников");
  return response.json();
};

// Обновление сотрудника в JSON-сервере
const updateEmployee = async ({
  id,
  status_id,
}: {
  id: number;
  status_id: number;
}) => {
  const response = await fetch(
    `http://localhost:3001/all-users-company/${id}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status_id }),
    }
  );
  if (!response.ok) throw new Error("Ошибка обновления сотрудника");
  return response.json();
};

const EmployeesPage: React.FC = () => {
  const { user, isTestMode } = useAuthStore();
  const [tab, setTab] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filterEmail, setFilterEmail] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterPhone, setFilterPhone] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [openModal, setOpenModal] = useState<
    "email" | "department" | "phone" | null
  >(null);
  const [editingEmployeeId, setEditingEmployeeId] = useState<number | null>(
    null
  );
  const [editedStatus, setEditedStatus] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<
    "email" | "department" | "phone" | null
  >(null);

  const queryClient = useQueryClient();
  const { data: employees = [], isLoading } = useQuery({
    queryKey: ["employees", user?.domain],
    queryFn: () => fetchEmployees(user?.domain || "orenburg"),
    enabled: isTestMode,
  });

  const mutation = useMutation({
    mutationFn: updateEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees", user?.domain] });
    },
  });

  const isAdmin = user?.role_id && [1, 2, 3].includes(user.role_id);

  // Фильтрация и сортировка сотрудников
  const filteredEmployees = employees
    .filter((e) => (tab === 0 ? true : e.status_id === tab))
    .filter((e) =>
      filterEmail
        ? e.email?.toLowerCase().includes(filterEmail.toLowerCase())
        : true
    )
    .filter((e) =>
      filterDepartment
        ? e.department?.toLowerCase().includes(filterDepartment.toLowerCase())
        : true
    )
    .filter((e) =>
      filterPhone
        ? e.phone?.toLowerCase().includes(filterPhone.toLowerCase())
        : true
    )
    .sort((a, b) => (sortOrder === "desc" ? b.id - a.id : a.id - b.id));

  const paginatedEmployees = filteredEmployees.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const tabCounts = [
    employees.length,
    employees.filter((e) => e.status_id === 1).length,
    employees.filter((e) => e.status_id === 2).length,
    employees.filter((e) => e.status_id === 3).length,
    employees.filter((e) => e.status_id === 4).length,
    employees.filter((e) => e.status_id === 5).length,
  ];

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) =>
    setTab(newValue);
  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const openFilterModal = (type: "email" | "department" | "phone") => {
    if (activeFilter === type) {
      if (type === "email") setFilterEmail("");
      if (type === "department") setFilterDepartment("");
      if (type === "phone") setFilterPhone("");
      setActiveFilter(null);
    } else {
      setOpenModal(type);
      setActiveFilter(type);
    }
  };
  const closeModal = () => setOpenModal(null);

  const applyFilter = () => {
    closeModal();
  };

  const handleEdit = (employee: User) => {
    setEditingEmployeeId(employee.id);
    setEditedStatus(employee.status_id);
  };

  const handleSave = (employeeId: number) => {
    if (editedStatus !== null) {
      mutation.mutate({ id: employeeId, status_id: editedStatus });
    }
    setEditingEmployeeId(null);
  };

  const getStatusChip = (statusId: number | null) => {
    if (statusId === null) return <Chip label="Неизвестно" size="small" />;
    switch (statusId) {
      case 1:
        return (
          <Chip
            color="success"
            size="small"
            icon={<CheckCircleIcon />}
            label={statusMap[statusId]}
          />
        );
      case 2:
      case 3:
      case 4:
        return (
          <Chip
            color="warning"
            size="small"
            icon={<WatchLaterIcon />}
            label={statusMap[statusId]}
          />
        );
      case 5:
        return (
          <Chip
            color="error"
            size="small"
            icon={<CancelIcon />}
            label={statusMap[statusId]}
          />
        );
      default:
        return <Chip label="Неизвестно" size="small" />;
    }
  };

  if (!isTestMode) {
    return <Typography>Страница доступна только в тестовом режиме</Typography>;
  }

  if (isLoading) {
    return <Typography>Загрузка...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">Список сотрудников</Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
        Информация по сотрудникам данного филиала
      </Typography>

      <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label={`Все (${tabCounts[0]})`} />
        <Tab label={`На работе (${tabCounts[1]})`} />
        <Tab label={`На больничном (${tabCounts[2]})`} />
        <Tab label={`В командировке (${tabCounts[3]})`} />
        <Tab label={`В отпуске (${tabCounts[4]})`} />
        <Tab label={`Уволены (${tabCounts[5]})`} />
      </Tabs>

      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Button
          variant={activeFilter === "email" ? "contained" : "outlined"}
          color="primary"
          size="small"
          onClick={() => openFilterModal("email")}
          startIcon={<EmailIcon />}
        >
          Email
        </Button>
        <Button
          variant={activeFilter === "department" ? "contained" : "outlined"}
          color="primary"
          size="small"
          onClick={() => openFilterModal("department")}
          startIcon={<GroupIcon />}
        >
          Отдел
        </Button>
        <Button
          variant={activeFilter === "phone" ? "contained" : "outlined"}
          color="primary"
          size="small"
          onClick={() => openFilterModal("phone")}
          startIcon={<CallIcon />}
        >
          Телефон
        </Button>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Сортировка</InputLabel>
          <Select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
          >
            <MenuItem value="desc">Фильтровать сначала новые записи</MenuItem>
            <MenuItem value="asc">Фильтровать сначала старые записи</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Modal open={openModal === "email"} onClose={closeModal}>
        <Box sx={modalStyle}>
          <TextField
            label="Email"
            value={filterEmail}
            onChange={(e) => setFilterEmail(e.target.value)}
            fullWidth
          />
          <Button onClick={applyFilter} sx={{ mt: 2 }}>
            Применить
          </Button>
        </Box>
      </Modal>
      <Modal open={openModal === "department"} onClose={closeModal}>
        <Box sx={modalStyle}>
          <FormControl fullWidth>
            <InputLabel>Отдел</InputLabel>
            <Select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
            >
              <MenuItem value="">Все</MenuItem>
              {["ОСЭиРЛИУС", "ПТО", "АСКУЭ", "ЛУНЦ", "ТоСё"].map((dep) => (
                <MenuItem key={dep} value={dep}>
                  {dep}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button onClick={applyFilter} sx={{ mt: 2 }}>
            Применить
          </Button>
        </Box>
      </Modal>
      <Modal open={openModal === "phone"} onClose={closeModal}>
        <Box sx={modalStyle}>
          <TextField
            label="Телефон"
            value={filterPhone}
            onChange={(e) => setFilterPhone(e.target.value)}
            fullWidth
          />
          <Button onClick={applyFilter} sx={{ mt: 2 }}>
            Применить
          </Button>
        </Box>
      </Modal>

      <Box sx={{ bgcolor: "background.paper", borderRadius: 2, boxShadow: 1 }}>
        <Table>
          <TableHead>
            <TableRow>
              {isAdmin && (
                <TableCell padding="checkbox">
                  <Checkbox />
                </TableCell>
              )}
              <TableCell>№</TableCell>
              <TableCell>ФИО / Должность</TableCell>
              <TableCell>Отдел</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Телефон</TableCell>
              <TableCell>Адрес</TableCell>
              <TableCell>Статус</TableCell>
              {isAdmin && <TableCell />}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedEmployees.map((e, index) => (
              <TableRow key={e.id}>
                {isAdmin && (
                  <TableCell padding="checkbox">
                    <Checkbox />
                  </TableCell>
                )}
                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Avatar
                      src={`/assets/avatar-${(e.id % 5) + 1}.png`}
                      sx={{ width: 32, height: 32 }}
                    />
                    <Box>
                      <Link
                        component={RouterLink}
                        to={`/employees/${e.id}`}
                        variant="subtitle2"
                        underline="hover"
                      >
                        {e.full_name}
                      </Link>
                      <Typography variant="body2" color="text.secondary">
                        {e.position || "Не указана"}
                      </Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell>{e.department}</TableCell>
                <TableCell>{e.email}</TableCell>
                <TableCell>{e.phone}</TableCell>
                <TableCell>{e.address || "Не указан"}</TableCell>
                <TableCell>
                  {editingEmployeeId === e.id ? (
                    <Select
                      value={editedStatus}
                      onChange={(e) =>
                        setEditedStatus(e.target.value as number)
                      }
                    >
                      {Object.entries(statusMap).map(([id, name]) => (
                        <MenuItem key={id} value={id}>
                          {name}
                        </MenuItem>
                      ))}
                    </Select>
                  ) : (
                    getStatusChip(e.status_id)
                  )}
                </TableCell>
                {isAdmin && (
                  <TableCell>
                    {editingEmployeeId === e.id ? (
                      <IconButton color="info" onClick={() => handleSave(e.id)}>
                        <SaveIcon />
                      </IconButton>
                    ) : (
                      <IconButton color="warning" onClick={() => handleEdit(e)}>
                        <EditIcon />
                      </IconButton>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredEmployees.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </Box>
  );
};

const modalStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

export default EmployeesPage;
