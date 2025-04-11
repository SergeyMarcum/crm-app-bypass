// src/pages/settings/index.tsx
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
import { useParams, Link } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store";
import { User } from "@/entities/user";
import { Employee } from "@/entities/employee";
import {
  Person as PersonIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as LightModeIcon,
  SettingsBrightness as SystemIcon,
  Group as GroupIcon,
} from "@mui/icons-material";

// Интерфейсы для типизации
interface ProfileTabProps {
  formData: Partial<User>;
  isCurrentUser: boolean;
}

interface EmployeeTabProps {
  employees: Employee[];
}

// Тип для данных из db.json
interface DbUser {
  id: string;
  full_name: string;
  email: string;
  position: string;
  department: string;
  phone: string;
  status_id: string | number;
  domain: string;
  role_id: string | number;
  company: string;
  name: string;
  address: string;
}

// Компонент вкладки "Профиль пользователя" (для другого пользователя)
const UserProfileTab: React.FC<ProfileTabProps> = ({ formData }) => {
  return (
    <Box>
      <Card
        sx={{
          mb: 3,
          borderRadius: 2,
          boxShadow: "0px 1px 2px rgba(0,0,0,0.08)",
        }}
      >
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: "neutral.200" }}>
              <PersonIcon />
            </Avatar>
          }
          title="Профиль пользователя"
          titleTypographyProps={{ variant: "h6" }}
        />
        <CardContent>
          <Stack spacing={3}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                src={formData.avatar || "/assets/avatar.png"}
                sx={{ width: 56, height: 56 }}
              />
              <Box>
                <Typography variant="subtitle1">
                  {formData.full_name || "Не указано"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formData.email || "Не указано"}
                </Typography>
              </Box>
            </Stack>
            <Typography>Телефон: {formData.phone || "Не указано"}</Typography>
            <Typography>Статус: {formData.status || "Не указано"}</Typography>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

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
    <Box>
      <Card
        sx={{
          mb: 3,
          borderRadius: 2,
          boxShadow: "0px 1px 2px rgba(0,0,0,0.08)",
        }}
      >
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: "neutral.200" }}>
              <PersonIcon />
            </Avatar>
          }
          title="Мой профиль"
          titleTypographyProps={{ variant: "h6" }}
        />
        <CardContent>
          <Stack spacing={3}>
            {/* Аватар */}
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                src={formData.avatar || "/assets/avatar.png"}
                sx={{ width: 56, height: 56 }}
              />
              <Typography variant="subtitle1">
                {formData.full_name || "Не указано"}
              </Typography>
            </Stack>

            {/* ФИО */}
            <TextField
              label="Полное имя"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              fullWidth
              variant="outlined"
            />

            {/* Email (disabled) */}
            <TextField
              label="Email"
              value={formData.email || "Не указано"}
              disabled
              fullWidth
              variant="outlined"
            />

            {/* Телефон */}
            <TextField
              label="Телефон"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              fullWidth
              variant="outlined"
            />

            {/* Статус */}
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
    </Box>
  );
};

// Компонент вкладки "Настройки"
const ThemeTab: React.FC = () => {
  const { theme, setTheme } = useAuthStore();

  const handleThemeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTheme(event.target.value as "light" | "dark" | "system");
  };

  return (
    <Box>
      <Card
        sx={{
          mb: 3,
          borderRadius: 2,
          boxShadow: "0px 1px 2px rgba(0,0,0,0.08)",
        }}
      >
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: "neutral.200" }}>
              <Brightness4Icon />
            </Avatar>
          }
          title="Настройки темы"
          titleTypographyProps={{ variant: "h6" }}
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
                      sx={{ bgcolor: "neutral.200", width: 40, height: 40 }}
                    >
                      <LightModeIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2">Светлый режим</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Лучше всего подходит для яркого окружения
                      </Typography>
                    </Box>
                  </Stack>
                }
                sx={{
                  mb: 1,
                  "& .MuiFormControlLabel-label": { flexGrow: 1 },
                }}
              />
              <FormControlLabel
                value="dark"
                control={<Radio />}
                label={
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                      sx={{ bgcolor: "neutral.200", width: 40, height: 40 }}
                    >
                      <Brightness4Icon />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2">Темный режим</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Рекомендуется для темных помещений
                      </Typography>
                    </Box>
                  </Stack>
                }
                sx={{
                  mb: 1,
                  "& .MuiFormControlLabel-label": { flexGrow: 1 },
                }}
              />
              <FormControlLabel
                value="system"
                control={<Radio />}
                label={
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                      sx={{ bgcolor: "neutral.200", width: 40, height: 40 }}
                    >
                      <SystemIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2">Система</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Адаптируется к теме вашего устройства
                      </Typography>
                    </Box>
                  </Stack>
                }
                sx={{
                  "& .MuiFormControlLabel-label": { flexGrow: 1 },
                }}
              />
            </RadioGroup>
          </FormControl>
        </CardContent>
      </Card>
    </Box>
  );
};

// Компонент вкладки "Мой отдел"
const DepartmentTab: React.FC<EmployeeTabProps> = ({ employees }) => {
  // Маппинг статусов из status_id в текстовое представление
  const statusMap: { [key: string]: string } = {
    "1": "работает",
    "2": "болеет",
    "3": "командировка",
    "4": "отпуск",
  };

  // Сортировка сотрудников по должности
  const sortedEmployees = [...employees].sort((a, b) => {
    const positionOrder: { [key: string]: number } = {
      "Начальник отдела": 1,
      "Заместитель начальника отдела": 2,
    };
    const aPosition = a.position || ""; // Обрабатываем случай, когда position === null
    const bPosition = b.position || "";
    const aOrder = positionOrder[aPosition] || 3;
    const bOrder = positionOrder[bPosition] || 3;
    return aOrder - bOrder;
  });

  return (
    <Box>
      <Card
        sx={{
          mb: 3,
          borderRadius: 2,
          boxShadow: "0px 1px 2px rgba(0,0,0,0.08)",
        }}
      >
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: "neutral.200" }}>
              <GroupIcon />
            </Avatar>
          }
          title={`Мой отдел: ${employees[0]?.department || "Не указано"}`}
          titleTypographyProps={{ variant: "h6" }}
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
                  <TableCell>{employee.phone}</TableCell>
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
    </Box>
  );
};

// Основной компонент страницы настроек
const SettingsPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>(); // Получаем userId из URL
  const { user } = useAuthStore();
  const [tab, setTab] = useState(userId ? 0 : 1); // Если есть userId, открываем "Профиль пользователя"
  const [departmentEmployees, setDepartmentEmployees] = useState<Employee[]>(
    []
  ); // Состояние для сотрудников отдела
  const [loading, setLoading] = useState(true); // Состояние загрузки
  const [error, setError] = useState<string | null>(null); // Состояние ошибки

  // Данные текущего пользователя
  const currentUserFormData: Partial<User> = {
    full_name: user?.full_name || "Не указано",
    email: user?.email || "Не указано",
    phone: user?.phone || "Не указано",
    status: user?.status || "работает",
    theme: user?.theme || "system",
    avatar: user?.avatar || "/assets/avatar.png",
    department: user?.department || "ОСЭиРЛИУС",
  };

  // Данные другого пользователя (mock)
  const otherUserFormData: Partial<User> = userId
    ? {
        full_name: "Софья Риверс",
        email: "sofia@devias.io",
        phone: "965 245 7623",
        status: "работает",
        avatar: "/assets/avatar.png",
      }
    : {};

  // Загрузка данных из db.json
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const response = await fetch("/db.json");
        if (!response.ok) {
          throw new Error("Не удалось загрузить данные");
        }
        const data = await response.json();
        const allUsers: DbUser[] = data["all-users-company"];

        // Преобразуем данные из db.json в формат Employee
        const employees: Employee[] = allUsers.map((dbUser: DbUser) => ({
          id: parseInt(dbUser.id),
          full_name: dbUser.full_name,
          email: dbUser.email,
          position: dbUser.position,
          department: dbUser.department,
          phone: dbUser.phone,
          hire_date: "", // В db.json нет hire_date
          status: statusMap[dbUser.status_id.toString()] || "active", // Используем statusMap для преобразования
          status_id: dbUser.status_id,
          manager_id: null,
          avatar: `/assets/avatar-${dbUser.id}.png`,
        }));

        // Фильтруем сотрудников по отделу текущего пользователя
        const filteredEmployees = employees.filter(
          (emp) => emp.department === currentUserFormData.department
        );

        setDepartmentEmployees(filteredEmployees);
        setLoading(false);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Произошла ошибка при загрузке данных"
        );
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [currentUserFormData.department]);

  // Редирект на профиль пользователя, если передан userId
  useEffect(() => {
    if (userId) {
      setTab(0);
    }
  }, [userId]);

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        maxWidth: "1200px",
        mx: "auto",
        display: "flex",
      }}
    >
      {/* Боковая панель */}
      <Stack
        sx={{
          width: "280px",
          pr: 3,
          borderRight: "1px solid",
          borderColor: "neutral.200",
        }}
      >
        {/* Информация о сотруднике (некликабельная) */}
        <Stack spacing={2} sx={{ mb: 3 }}>
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
        </Stack>

        {/* Вкладки */}
        <Stack spacing={1}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
            Личное
          </Typography>
          <Box>
            {userId && (
              <Button
                component={Link}
                to={`/settings/user/${userId}`}
                startIcon={<PersonIcon />}
                sx={{
                  justifyContent: "flex-start",
                  width: "100%",
                  textTransform: "none",
                  color: tab === 0 ? "primary.main" : "text.primary",
                  bgcolor: tab === 0 ? "primary.50" : "transparent",
                  p: 1,
                  borderRadius: 1,
                }}
              >
                Профиль пользователя
              </Button>
            )}
            <Button
              component={Link}
              to="/settings"
              startIcon={<PersonIcon />}
              sx={{
                justifyContent: "flex-start",
                width: "100%",
                textTransform: "none",
                color: tab === 1 ? "primary.main" : "text.primary",
                bgcolor: tab === 1 ? "primary.50" : "transparent",
                p: 1,
                borderRadius: 1,
              }}
              onClick={() => setTab(1)}
            >
              Мой профиль
            </Button>
            <Button
              component={Link}
              to="/settings"
              startIcon={<Brightness4Icon />}
              sx={{
                justifyContent: "flex-start",
                width: "100%",
                textTransform: "none",
                color: tab === 2 ? "primary.main" : "text.primary",
                bgcolor: tab === 2 ? "primary.50" : "transparent",
                p: 1,
                borderRadius: 1,
              }}
              onClick={() => setTab(2)}
            >
              Настройки
            </Button>
          </Box>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mb: 1, mt: 2 }}
          >
            Организация
          </Typography>
          <Box>
            <Button
              component={Link}
              to="/settings"
              startIcon={<GroupIcon />}
              sx={{
                justifyContent: "flex-start",
                width: "100%",
                textTransform: "none",
                color: tab === 3 ? "primary.main" : "text.primary",
                bgcolor: tab === 3 ? "primary.50" : "transparent",
                p: 1,
                borderRadius: 1,
              }}
              onClick={() => setTab(3)}
            >
              Мой отдел
            </Button>
          </Box>
        </Stack>
      </Stack>

      {/* Контент */}
      <Box sx={{ flexGrow: 1, pl: 3 }}>
        {tab === 0 && userId && (
          <UserProfileTab formData={otherUserFormData} isCurrentUser={false} />
        )}
        {tab === 1 && (
          <ProfileTab formData={currentUserFormData} isCurrentUser={true} />
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
