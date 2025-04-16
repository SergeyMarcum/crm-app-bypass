import React, { useState, useMemo, useCallback } from "react";
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
  IconButton,
  Chip,
  Stack,
} from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/store";
import { userApi, AllUsersCompanyResponse } from "@/shared/api/userApi";
import { User } from "@/entities/user";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import EmailIcon from "@mui/icons-material/Email";
import GroupIcon from "@mui/icons-material/Group";
import CallIcon from "@mui/icons-material/Call";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import CancelIcon from "@mui/icons-material/Cancel";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {
  ColDef,
  ICellRendererParams,
  ModuleRegistry,
  ClientSideRowModelModule,
  GridApi,
} from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { CheckboxRenderer } from "@/features/user-list/components/CheckboxRenderer";
import { HeaderCheckboxRenderer } from "@/features/user-list/components/HeaderCheckboxRenderer";

// Регистрация модулей AG Grid
ModuleRegistry.register(ClientSideRowModelModule);

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

const departments = ["ОСЭиРЛИУС", "ПТО", "АСКУЭ", "ЛУНЦ", "ТоСё"];

const UsersPage: React.FC = () => {
  const { user, isTestMode, domain } = useAuthStore();
  const [tab, setTab] = useState(0);
  const [activeFilter, setActiveFilter] = useState<
    "email" | "department" | "phone" | null
  >(null);
  const [openModal, setOpenModal] = useState<
    "email" | "department" | "phone" | null
  >(null);
  const [filterEmail, setFilterEmail] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterPhone, setFilterPhone] = useState("");
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [editedUser, setEditedUser] = useState<Partial<User>>({});
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [groupEdit, setGroupEdit] = useState<{
    department?: string;
    role_id?: number;
    status_id?: number;
  }>({});
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc"); // Сортировка: новые или старые
  const [paginationPageSize, setPaginationPageSize] = useState<number>(10); // Количество записей на странице

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<AllUsersCompanyResponse>({
    queryKey: ["users", domain, isTestMode],
    queryFn: () =>
      isTestMode
        ? userApi.getAllUsersCompanyTest(domain || "orenburg")
        : userApi.getAllUsersCompany(),
    enabled: !!domain,
  });

  const users: User[] = Array.isArray(data?.users) ? data.users : [];

  const isAdmin = !!user?.role_id && [1, 2, 8].includes(user.role_id);

  // Фильтрация и сортировка пользователей
  const filteredUsers = useMemo(() => {
    const result = users
      .filter((u: User) => (tab === 0 ? true : u.status_id === tab))
      .filter((u: User) =>
        filterEmail
          ? u.email?.toLowerCase().includes(filterEmail.toLowerCase())
          : true
      )
      .filter((u: User) =>
        filterDepartment
          ? u.department?.toLowerCase().includes(filterDepartment.toLowerCase())
          : true
      )
      .filter((u: User) =>
        filterPhone
          ? u.phone?.toLowerCase().includes(filterPhone.toLowerCase())
          : true
      );

    // Сортировка по ID (предполагаем, что новые записи имеют больший ID)
    result.sort((a, b) => (sortOrder === "desc" ? b.id - a.id : a.id - b.id));

    return result;
  }, [users, tab, filterEmail, filterDepartment, filterPhone, sortOrder]);

  // Определение столбцов таблицы
  const columnDefs = useMemo<ColDef<User>[]>(() => {
    const baseColumns: ColDef<User>[] = [
      {
        headerName: "",
        cellRenderer: CheckboxRenderer,
        headerComponent: HeaderCheckboxRenderer,
        width: 50,
      },
      {
        headerName: "№",
        width: 80,
        sortable: true,
        valueGetter: (params) =>
          params.node?.rowIndex != null ? params.node.rowIndex + 1 : "",
      },
      {
        field: "full_name",
        headerName: "ФИО пользователя",
        width: 200,
        sortable: true,
        cellRenderer: (params: ICellRendererParams<User>) => {
          if (!params.data) return null;
          if (editingUserId === params.data.id) {
            return (
              <TextField
                value={editedUser.full_name ?? params.data.full_name ?? ""}
                onChange={(e) =>
                  setEditedUser({ ...editedUser, full_name: e.target.value })
                }
                size="small"
                fullWidth
              />
            );
          }
          return (
            <Stack direction="row" alignItems="center" spacing={1}>
              {params.data.avatar ? (
                <img
                  src={params.data.avatar}
                  alt="avatar"
                  style={{ width: 32, height: 32, borderRadius: "50%" }}
                />
              ) : (
                <AccountCircleIcon sx={{ fontSize: 32, color: "#bdbdbd" }} />
              )}
              <Typography variant="subtitle2">
                {params.data.full_name || params.data.name}
              </Typography>
            </Stack>
          );
        },
      },
      {
        field: "department",
        headerName: "Отдел",
        width: 150,
        sortable: true,
        cellRenderer: (params: ICellRendererParams<User>) => {
          if (!params.data) return null;
          if (editingUserId === params.data.id) {
            return (
              <Select
                value={editedUser.department ?? params.data.department ?? ""}
                onChange={(e) =>
                  setEditedUser({ ...editedUser, department: e.target.value })
                }
                size="small"
                fullWidth
              >
                <MenuItem value="">Не указано</MenuItem>
                {departments.map((dep) => (
                  <MenuItem key={dep} value={dep}>
                    {dep}
                  </MenuItem>
                ))}
              </Select>
            );
          }
          return params.data.department ?? "Не указан";
        },
      },
      {
        field: "email",
        headerName: "Email",
        width: 200,
        sortable: true,
        cellRenderer: (params: ICellRendererParams<User>) => {
          if (!params.data) return null;
          if (editingUserId === params.data.id) {
            return (
              <TextField
                value={editedUser.email ?? params.data.email ?? ""}
                onChange={(e) =>
                  setEditedUser({ ...editedUser, email: e.target.value })
                }
                size="small"
                fullWidth
              />
            );
          }
          return params.data.email ?? "Не указан";
        },
      },
      {
        field: "phone",
        headerName: "Телефон",
        width: 150,
        sortable: true,
        cellRenderer: (params: ICellRendererParams<User>) => {
          if (!params.data) return null;
          if (editingUserId === params.data.id) {
            return (
              <TextField
                value={editedUser.phone ?? params.data.phone ?? ""}
                onChange={(e) =>
                  setEditedUser({ ...editedUser, phone: e.target.value })
                }
                size="small"
                fullWidth
              />
            );
          }
          return params.data.phone ?? "Не указан";
        },
      },
      {
        field: "role_id",
        headerName: "Права доступа",
        width: 200,
        sortable: true,
        cellRenderer: (params: ICellRendererParams<User>) => {
          if (!params.data) return null;
          if (editingUserId === params.data.id) {
            return (
              <Select
                value={editedUser.role_id ?? params.data.role_id ?? ""}
                onChange={(e) =>
                  setEditedUser({
                    ...editedUser,
                    role_id: e.target.value as number,
                  })
                }
                size="small"
                fullWidth
              >
                {Object.entries(roleMap).map(([id, name]) => (
                  <MenuItem key={id} value={id}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            );
          }
          return roleMap[params.data.role_id] || "Неизвестно";
        },
      },
      {
        field: "status_id",
        headerName: "Статус",
        width: 150,
        sortable: true,
        cellRenderer: (params: ICellRendererParams<User>) => {
          if (!params.data) return null;
          if (editingUserId === params.data.id) {
            return (
              <Select
                value={editedUser.status_id ?? params.data.status_id ?? ""}
                onChange={(e) =>
                  setEditedUser({
                    ...editedUser,
                    status_id: e.target.value as number,
                  })
                }
                size="small"
                fullWidth
              >
                {Object.entries(statusMap).map(([id, name]) => (
                  <MenuItem key={id} value={id}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            );
          }
          const statusId = params.data.status_id;
          if (statusId === null || statusId === undefined)
            return <Chip label="Неизвестно" size="small" />;
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
        },
      },
      {
        headerName: "Действия",
        width: 100,
        cellRenderer: (params: ICellRendererParams<User>) => {
          if (!params.data || !isAdmin) return null;
          const userData = params.data;
          return editingUserId === userData.id ? (
            <IconButton color="info" onClick={() => handleSave(userData.id)}>
              <SaveIcon />
            </IconButton>
          ) : (
            <IconButton color="warning" onClick={() => handleEdit(userData)}>
              <EditIcon />
            </IconButton>
          );
        },
      },
    ];

    return baseColumns;
  }, [isAdmin, editingUserId, editedUser]);

  const mutation = useMutation({
    mutationFn: (data: Partial<User> & { user_id: number }) =>
      isTestMode ? userApi.editUserTest(data) : userApi.editUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users", domain, isTestMode],
      });
      setEditingUserId(null);
      setEditedUser({});
    },
    onError: (error) => {
      console.error("Ошибка при сохранении пользователя:", error);
    },
  });

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) =>
    setTab(newValue);

  const toggleFilter = (filter: "email" | "department" | "phone") => {
    if (activeFilter === filter) {
      if (filter === "email") setFilterEmail("");
      if (filter === "department") setFilterDepartment("");
      if (filter === "phone") setFilterPhone("");
      setActiveFilter(null);
      setOpenModal(null);
    } else {
      setActiveFilter(filter);
      setOpenModal(filter);
    }
  };

  const closeModal = () => setOpenModal(null);

  const applyFilter = () => closeModal();

  const handleEdit = useCallback((user: User) => {
    setEditingUserId(user.id);
    setEditedUser({
      full_name: user.full_name,
      email: user.email,
      department: user.department,
      phone: user.phone,
      role_id: user.role_id,
      status_id: user.status_id,
    });
  }, []);

  const handleSave = useCallback(
    (userId: number) => {
      // Отправляем только измененные поля
      const updatedFields: Partial<User> & { user_id: number } = {
        user_id: userId,
      };
      const originalUser = users.find((u) => u.id === userId);

      if (!originalUser) return;

      if (
        editedUser.full_name !== undefined &&
        editedUser.full_name !== originalUser.full_name
      ) {
        updatedFields.full_name = editedUser.full_name;
      }
      if (
        editedUser.email !== undefined &&
        editedUser.email !== originalUser.email
      ) {
        updatedFields.email = editedUser.email;
      }
      if (
        editedUser.department !== undefined &&
        editedUser.department !== originalUser.department
      ) {
        updatedFields.department = editedUser.department;
      }
      if (
        editedUser.phone !== undefined &&
        editedUser.phone !== originalUser.phone
      ) {
        updatedFields.phone = editedUser.phone;
      }
      if (
        editedUser.role_id !== undefined &&
        editedUser.role_id !== originalUser.role_id
      ) {
        updatedFields.role_id = editedUser.role_id;
      }
      if (
        editedUser.status_id !== undefined &&
        editedUser.status_id !== originalUser.status_id
      ) {
        updatedFields.status_id = editedUser.status_id;
      }

      // Проверяем, есть ли измененные поля
      if (Object.keys(updatedFields).length > 1) {
        // user_id не считается
        mutation.mutate({
          // Исправлено: mutation.mutate вместо mutation muda
          ...updatedFields,
        });
      } else {
        // Если ничего не изменилось, просто закрываем редактирование
        setEditingUserId(null);
        setEditedUser({});
      }
    },
    [editedUser, users, mutation]
  );

  const handleGroupSave = useCallback(() => {
    if (!gridApi) return;
    const selectedNodes = gridApi.getSelectedNodes();
    if (selectedNodes.length > 0) {
      selectedNodes.forEach((node) => {
        const user = node.data as User;
        const updatedFields: Partial<User> & { user_id: number } = {
          user_id: user.id,
        };
        if (groupEdit.department)
          updatedFields.department = groupEdit.department;
        if (groupEdit.role_id !== undefined)
          updatedFields.role_id = groupEdit.role_id;
        if (groupEdit.status_id !== undefined)
          updatedFields.status_id = groupEdit.status_id;

        if (Object.keys(updatedFields).length > 1) {
          mutation.mutate(updatedFields);
        }
      });
      setGroupEdit({});
    }
  }, [gridApi, groupEdit, mutation]);

  const onGridReady = useCallback((params: { api: GridApi }) => {
    setGridApi(params.api);
  }, []);

  if (isLoading) {
    return <Typography>Загрузка...</Typography>;
  }
  if (isLoading || !filteredUsers) {
    return <Typography>Загрузка...</Typography>;
  }
  const tabCounts = [
    users.length,
    users.filter((u: User) => u.status_id === 1).length,
    users.filter((u: User) => u.status_id === 5).length, // Больничный
    users.filter((u: User) => u.status_id === 4).length, // Командировка
    users.filter((u: User) => u.status_id === 3).length, // Отпуск
    users.filter((u: User) => u.status_id === 2).length, // Уволен(а)
  ];

  const hasSelectedRows = (gridApi?.getSelectedNodes()?.length ?? 0) > 0;

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },

        minWidth: "1400px",
        mx: "auto",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h4">Список пользователей</Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
        Информация по пользователям данного филиала
      </Typography>

      <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label={`Все (${tabCounts[0]})`} />
        <Tab label={`Работает (${tabCounts[1]})`} />
        <Tab label={`Больничный (${tabCounts[2]})`} />
        <Tab label={`Командировка (${tabCounts[3]})`} />
        <Tab label={`Отпуск (${tabCounts[4]})`} />
        <Tab label={`Уволен(а) (${tabCounts[5]})`} />
      </Tabs>

      <Box sx={{ display: "flex", gap: 2, mb: 2, alignItems: "center" }}>
        <Button
          variant={activeFilter === "email" ? "contained" : "outlined"}
          color="primary"
          size="small"
          onClick={() => toggleFilter("email")}
          startIcon={<EmailIcon />}
        >
          Email
        </Button>
        <Button
          variant={activeFilter === "department" ? "contained" : "outlined"}
          color="primary"
          size="small"
          onClick={() => toggleFilter("department")}
          startIcon={<GroupIcon />}
        >
          Отдел
        </Button>
        <Button
          variant={activeFilter === "phone" ? "contained" : "outlined"}
          color="primary"
          size="small"
          onClick={() => toggleFilter("phone")}
          startIcon={<CallIcon />}
        >
          Телефон
        </Button>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Сортировка</InputLabel>
          <Select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
          >
            <MenuItem value="desc">Сначала новые записи</MenuItem>
            <MenuItem value="asc">Сначала старые записи</MenuItem>
          </Select>
        </FormControl>
        {hasSelectedRows && (
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="subtitle1">Групповой редактор:</Typography>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Отдел</InputLabel>
              <Select
                value={groupEdit.department ?? ""}
                onChange={(e) =>
                  setGroupEdit({ ...groupEdit, department: e.target.value })
                }
              >
                <MenuItem value="">Не менять</MenuItem>
                {departments.map((dep) => (
                  <MenuItem key={dep} value={dep}>
                    {dep}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Права доступа</InputLabel>
              <Select
                value={groupEdit.role_id ?? ""}
                onChange={(e) =>
                  setGroupEdit({
                    ...groupEdit,
                    role_id: e.target.value as number,
                  })
                }
              >
                <MenuItem value="">Не менять</MenuItem>
                {Object.entries(roleMap).map(([id, name]) => (
                  <MenuItem key={id} value={id}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Статус</InputLabel>
              <Select
                value={groupEdit.status_id ?? ""}
                onChange={(e) =>
                  setGroupEdit({
                    ...groupEdit,
                    status_id: e.target.value as number,
                  })
                }
              >
                <MenuItem value="">Не менять</MenuItem>
                {Object.entries(statusMap).map(([id, name]) => (
                  <MenuItem key={id} value={id}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <IconButton color="info" onClick={handleGroupSave}>
              <SaveIcon />
            </IconButton>
          </Stack>
        )}
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
              {departments.map((dep) => (
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

      <Box
        className="ag-theme-alpine"
        sx={{
          height: 600,
          width: "100%",
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 1,
          "& .ag-cell": {
            display: "flex",
            alignItems: "center",
          },
        }}
      >
        <AgGridReact<User>
          rowData={filteredUsers}
          columnDefs={columnDefs}
          defaultColDef={{ resizable: true, sortable: true }}
          rowSelection="multiple"
          pagination
          paginationPageSize={paginationPageSize}
          suppressRowClickSelection={true}
          onGridReady={onGridReady}
        />
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Typography variant="subtitle2">
          Всего записей: {filteredUsers.length}
        </Typography>
        <FormControl size="small">
          <InputLabel>Записей на странице</InputLabel>
          <Select
            value={paginationPageSize}
            onChange={(e) => setPaginationPageSize(Number(e.target.value))}
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>
        </FormControl>
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

export default UsersPage;
