import React, { useState, useEffect } from "react";
import {
  Box,
  Stack,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import { useAuthStore } from "@/features/auth/store";
import { User } from "@/entities/user";
import { Employee } from "@/entities/employee";
import { getEmployeesByDepartment } from "@/shared/api/employeeApi";
import {
  Person as PersonIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as LightModeIcon,
  SettingsBrightness as SystemIcon,
  Group as GroupIcon,
} from "@mui/icons-material";

// Стили для карточек
const cardSx = {
  borderRadius: 2,
  boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
  bgcolor: "background.paper",

  minWidth: "1300px",
  mx: "auto",
};

// Интерфейсы
interface ProfileTabProps {
  formData: Partial<User>;
  isCurrentUser: boolean;
}

interface EmployeeTabProps {
  employees: Employee[];
}

// Компонент вкладки "Мой профиль"
const ProfileTab: React.FC<ProfileTabProps> = ({ formData }) => {
  const { updateUser, logout } = useAuthStore();
  const [fullName, setFullName] = useState(formData.full_name || "");
  const [phone, setPhone] = useState(formData.phone || "");
  const [status, setStatus] = useState(formData.status || "работает");

  const handleSave = () => {
    updateUser({ full_name: fullName, phone, status });
  };

  const handleDelete = () => {
    updateUser({ status: "уволен" });
    logout();
  };

  return (
    <Card sx={cardSx}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: "primary.main" }}>
            <PersonIcon />
          </Avatar>
        }
        title="Мой профиль"
        titleTypographyProps={{ variant: "h5", fontWeight: 600 }}
        subheader="Обновите информацию о вашем профиле"
        subheaderTypographyProps={{ variant: "body2", color: "text.secondary" }}
      />
      <CardContent>
        <Stack spacing={3}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              src={formData.avatar || "/assets/avatar.png"}
              sx={{ width: 64, height: 64 }}
            />
            <Typography variant="subtitle1">
              {fullName || "Не указано"}
            </Typography>
          </Stack>
          <TextField
            label="Полное имя"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            fullWidth
            variant="outlined"
          />
          <TextField
            label="Email"
            value={formData.email || "Не указано"}
            disabled
            fullWidth
            variant="outlined"
          />
          <TextField
            label="Телефон"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            fullWidth
            variant="outlined"
          />
          <FormControl fullWidth>
            <InputLabel>Статус</InputLabel>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              label="Статус"
            >
              <MenuItem value="работает">Работает</MenuItem>
              <MenuItem value="командировка">Командировка</MenuItem>
              <MenuItem value="болеет">Болеет</MenuItem>
              <MenuItem value="отпуск">Отпуск</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </CardContent>
      <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
        <Button variant="outlined" color="error" onClick={handleDelete}>
          Удалить профиль
        </Button>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Сохранить
        </Button>
      </CardActions>
    </Card>
  );
};

// Компонент вкладки "Настройки"
const ThemeTab: React.FC = () => {
  const { theme, setTheme } = useAuthStore();

  const handleThemeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTheme(event.target.value as "light" | "dark" | "system");
  };

  return (
    <Card sx={cardSx}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: "primary.main" }}>
            <Brightness4Icon />
          </Avatar>
        }
        title="Настройки темы"
        titleTypographyProps={{ variant: "h5", fontWeight: 600 }}
        subheader="Выберите предпочитаемый режим отображения"
        subheaderTypographyProps={{ variant: "body2", color: "text.secondary" }}
      />
      <CardContent>
        <FormControl component="fieldset">
          <RadioGroup value={theme} onChange={handleThemeChange}>
            <FormControlLabel
              value="light"
              control={<Radio />}
              label={
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar
                    sx={{ bgcolor: "neutral.100", width: 40, height: 40 }}
                  >
                    <LightModeIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1">Светлый режим</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Лучше всего подходит для яркого окружения
                    </Typography>
                  </Box>
                </Stack>
              }
              sx={{ mb: 2 }}
            />
            <FormControlLabel
              value="dark"
              control={<Radio />}
              label={
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar
                    sx={{ bgcolor: "neutral.100", width: 40, height: 40 }}
                  >
                    <Brightness4Icon />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1">Темный режим</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Рекомендуется для темных помещений
                    </Typography>
                  </Box>
                </Stack>
              }
              sx={{ mb: 2 }}
            />
            <FormControlLabel
              value="system"
              control={<Radio />}
              label={
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar
                    sx={{ bgcolor: "neutral.100", width: 40, height: 40 }}
                  >
                    <SystemIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1">Система</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Адаптируется к теме вашего устройства
                    </Typography>
                  </Box>
                </Stack>
              }
            />
          </RadioGroup>
        </FormControl>
      </CardContent>
    </Card>
  );
};

// Компонент вкладки "Мой отдел"
const DepartmentTab: React.FC<EmployeeTabProps> = ({ employees }) => {
  const statusMap: { [key: string]: string } = {
    "1": "работает",
    "2": "болеет",
    "3": "командировка",
    "4": "отпуск",
  };

  const sortedEmployees = [...employees].sort((a, b) => {
    const positionOrder: { [key: string]: number } = {
      "Начальник отдела": 1,
      "Заместитель начальника отдела": 2,
    };
    const aPosition = a.position || "";
    const bPosition = b.position || "";
    const aOrder = positionOrder[aPosition] || 3;
    const bOrder = positionOrder[bPosition] || 3;
    return aOrder - bOrder;
  });

  return (
    <Card sx={cardSx}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: "primary.main" }}>
            <GroupIcon />
          </Avatar>
        }
        title={`Мой отдел: ${employees[0]?.department || "Не указано"}`}
        titleTypographyProps={{ variant: "h5", fontWeight: 600 }}
        subheader="Список сотрудников вашего отдела"
        subheaderTypographyProps={{ variant: "body2", color: "text.secondary" }}
      />
      <CardContent>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>№</TableCell>
              <TableCell>ФИО / Email</TableCell>
              <TableCell>Должность</TableCell>
              <TableCell>Телефон</TableCell>
              <TableCell>Статус</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedEmployees.map((employee, index) => (
              <TableRow key={employee.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                      src={employee.avatar || "/assets/avatar.png"}
                      sx={{ width: 40, height: 40 }}
                    />
                    <Box>
                      <Typography variant="body1">
                        {employee.full_name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {employee.email}
                      </Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell>{employee.position || "Не указано"}</TableCell>
                <TableCell>{employee.phone || "Не указано"}</TableCell>
                <TableCell>
                  {statusMap[employee.status_id?.toString() || ""] ||
                    "Не указано"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

// Основной компонент страницы настроек
const SettingsPage: React.FC = () => {
  const { user, isTestMode } = useAuthStore();
  const [tab, setTab] = useState(1);
  const [departmentEmployees, setDepartmentEmployees] = useState<Employee[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Данные текущего пользователя
  const currentUserFormData: Partial<User> = {
    full_name: user?.full_name || "Не указано",
    email: user?.email || "Не указано",
    phone: user?.phone || "Не указано",
    status: user?.status || "работает",
    avatar: user?.avatar || "/assets/avatar.png",
    department: user?.department || "ОСЭиРЛИУС",
  };

  // Отладка: логируем user для проверки
  useEffect(() => {
    console.log("Auth user:", user);
    console.log("currentUserFormData:", currentUserFormData);
  }, [user]);

  // Загрузка сотрудников отдела
  useEffect(() => {
    const fetchEmployees = async () => {
      if (!currentUserFormData.department || tab !== 3) return;
      setLoading(true);
      try {
        const employees = await getEmployeesByDepartment(
          currentUserFormData.department,
          isTestMode
        );
        setDepartmentEmployees(employees);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Ошибка загрузки сотрудников"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, [currentUserFormData.department, isTestMode, tab]);

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        maxWidth: "1300px", // Задаём максимальную ширину
        mx: "auto",
        display: "flex",
        minHeight: "100vh",
      }}
    >
      {/* Боковая панель */}
      <Stack
        sx={{
          width: { xs: "100%", sm: 260 },
          pr: { sm: 3 },
          flexShrink: 0,
        }}
      >
        <Stack spacing={2} sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            fontWeight={600}
            color="text.primary" // Задаём основной цвет текста
          >
            Настройки
          </Typography>
          {user ? (
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                src={currentUserFormData.avatar}
                sx={{ width: 40, height: 40 }}
              />
              <Box>
                <Typography variant="subtitle1">
                  {currentUserFormData.full_name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {currentUserFormData.email}
                </Typography>
              </Box>
            </Stack>
          ) : (
            <Typography color="error">Пользователь не авторизован</Typography>
          )}
        </Stack>
        <Stack spacing={1}>
          <Button
            startIcon={<PersonIcon />}
            sx={{
              justifyContent: "flex-start",
              color: tab === 1 ? "primary.main" : "text.primary",
              bgcolor: tab === 1 ? "primary.50" : "transparent",
              p: 1.5,
              borderRadius: 1,
              textTransform: "none",
              fontWeight: tab === 1 ? 600 : 400,
            }}
            onClick={() => setTab(1)}
          >
            Мой профиль
          </Button>
          <Button
            startIcon={<Brightness4Icon />}
            sx={{
              justifyContent: "flex-start",
              color: tab === 2 ? "primary.main" : "text.primary",
              bgcolor: tab === 2 ? "primary.50" : "transparent",
              p: 1.5,
              borderRadius: 1,
              textTransform: "none",
              fontWeight: tab === 2 ? 600 : 400,
            }}
            onClick={() => setTab(2)}
          >
            Настройки
          </Button>
          <Button
            startIcon={<GroupIcon />}
            sx={{
              justifyContent: "flex-start",
              color: tab === 3 ? "primary.main" : "text.primary",
              bgcolor: tab === 3 ? "primary.50" : "transparent",
              p: 1.5,
              borderRadius: 1,
              textTransform: "none",
              fontWeight: tab === 3 ? 600 : 400,
            }}
            onClick={() => setTab(3)}
          >
            Мой отдел
          </Button>
        </Stack>
      </Stack>

      {/* Контент */}
      <Box
        sx={{
          flexGrow: 1,
          pl: { sm: 3 },
          pt: { xs: 2, sm: 0 },
          width: "100%", // Растягиваем контейнер
          display: "flex",
          flexDirection: "column",
        }}
      >
        {tab === 1 && (
          <ProfileTab formData={currentUserFormData} isCurrentUser />
        )}
        {tab === 2 && <ThemeTab />}
        {tab === 3 && (
          <>
            {loading && <Typography>Загрузка...</Typography>}
            {error && <Typography color="error">{error}</Typography>}
            {!loading && !error && departmentEmployees.length > 0 && (
              <DepartmentTab employees={departmentEmployees} />
            )}
            {!loading && !error && departmentEmployees.length === 0 && (
              <Typography>Сотрудники в вашем отделе не найдены.</Typography>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default SettingsPage;
