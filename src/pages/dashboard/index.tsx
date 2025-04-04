import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Button,
  CircularProgress,
  Stack,
  CardHeader,
} from "@mui/material";
import Grid from "@mui/material/Grid"; // Grid v2 в MUI v7
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Calendar, ArrowUp } from "@phosphor-icons/react";
import DomainIcon from "@mui/icons-material/Domain";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AssignmentLateIcon from "@mui/icons-material/AssignmentLate";
import AppUsageChart from "./AppUsageChart";

interface DashboardData {
  metrics: { tickets: number; signUps: number; openIssues: number };
  chart: { month: string; thisYear: number; lastYear: number }[];
  subscriptions: { name: string; price: string; status: string }[];
  chat: { name: string; message: string; time: string }[];
  events: { date: string; time: string; title: string }[];
  appLimits: number;
}

const chartData: DashboardData["chart"] = [
  { month: "Янв", thisYear: 400, lastYear: 240 },
  { month: "Фев", thisYear: 300, lastYear: 139 },
  { month: "Мар", thisYear: 200, lastYear: 180 },
  { month: "Апр", thisYear: 278, lastYear: 90 },
  { month: "Май", thisYear: 189, lastYear: 110 },
  { month: "Июн", thisYear: 239, lastYear: 180 },
  { month: "Июл", thisYear: 349, lastYear: 230 },
  { month: "Авг", thisYear: 200, lastYear: 50 },
  { month: "Сен", thisYear: 278, lastYear: 190 },
  { month: "Окт", thisYear: 189, lastYear: 180 },
  { month: "Ноя", thisYear: 239, lastYear: 180 },
  { month: "Дек", thisYear: 349, lastYear: 130 },
];

const subscriptions: DashboardData["subscriptions"] = [
  { name: "На рабочем месте", price: "115", status: "Работает" },
  { name: "Находятся в командировке", price: "3", status: "Командировка" },
  {
    name: "Находятся на лечении в связи со временной нетрудоспособностью",
    price: "10",
    status: "Больничный",
  },
  { name: "Находятся в отпуске", price: "15", status: "Отпуск" },
  { name: "Уволенные сотрудники", price: "4", status: "Уволен(а)" },
];

const chatData: DashboardData["chat"] = [
  {
    name: "Мастер 1",
    message: "Здравствуйте, необходимо загрузить отчет до 01.04",
    time: "2 мин. назад",
  },
  {
    name: "Мастер 1",
    message: "Здравствуйте, необходимо проверить объект №4",
    time: "2 часа назад",
  },
  {
    name: "Мастер 2",
    message: "Здравствуйте, необходимо проверить объект №3",
    time: "3 часов назад",
  },
  {
    name: "Мастер 2",
    message: "Здравствуйте, необходимо проверить объект №2",
    time: "8 часов назад",
  },
];

const eventsData: DashboardData["events"] = [
  { date: "МАР 28", time: "08:00", title: "Проверка объекта №1" },
  { date: "МАР 31", time: "10:45", title: "Проверка объекта №2" },
  { date: "МАР 31", time: "23:30", title: "Проверка объекта №3" },
  { date: "АПР 3", time: "09:00", title: "Проверка объекта №4" },
];

const fetchDashboardData = async (): Promise<DashboardData> => {
  return {
    metrics: { tickets: 31, signUps: 240, openIssues: 21 },
    chart: chartData,
    subscriptions,
    chat: chatData,
    events: eventsData,
    appLimits: 80,
  };
};

export function DashboardPage() {
  const { data, isLoading } = useQuery<DashboardData>({
    queryKey: ["dashboardData"],
    queryFn: fetchDashboardData,
    initialData: {
      metrics: { tickets: 31, signUps: 240, openIssues: 21 },
      chart: chartData,
      subscriptions,
      chat: chatData,
      events: eventsData,
      appLimits: 80,
    },
  });

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Загрузка данных...
        </Typography>
      </Box>
    );
  }

  const cardSx = { elevation: 4, borderRadius: 4, p: 2 };

  return (
    <Box sx={{ p: 3 }}>
      {/* Метрики */}
      <Grid container spacing={3} sx={{ mb: 4, width: "100%" }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card sx={cardSx}>
            <CardContent>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ mb: 1 }}
              >
                <DomainIcon
                  sx={{
                    boxShadow: 5,
                    width: 45,
                    height: 45,
                    p: 1,
                    borderRadius: 6,
                    color: "gray",
                  }}
                />
                <Stack>
                  <Typography variant="body1" color="text.secondary">
                    Количество объектов
                  </Typography>
                  <Typography variant="h4">{data.metrics.tickets}</Typography>
                </Stack>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <ArrowUp size={16} color="green" />
                <Typography variant="body2" color="success.main">
                  +15% увеличение по сравнению с прошлым месяцем
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card sx={cardSx}>
            <CardContent>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ mb: 1 }}
              >
                <AssignmentIcon
                  sx={{
                    boxShadow: 5,
                    width: 45,
                    height: 45,
                    p: 1,
                    borderRadius: 6,
                    color: "gray",
                  }}
                />
                <Stack>
                  <Typography variant="body1" color="text.secondary">
                    Количество проверенных объектов
                  </Typography>
                  <Typography variant="h4">{data.metrics.signUps}</Typography>
                </Stack>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <ArrowUp
                  size={16}
                  color="red"
                  style={{ transform: "rotate(180deg)" }}
                />
                <Typography variant="body2" color="error.main">
                  -5% снижение по сравнению с прошлым месяцем
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card sx={cardSx}>
            <CardContent>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ mb: 1 }}
              >
                <AssignmentLateIcon
                  sx={{
                    boxShadow: 5,
                    width: 45,
                    height: 45,
                    p: 1,
                    borderRadius: 6,
                    color: "gray",
                  }}
                />
                <Stack>
                  <Typography variant="body1" color="text.secondary">
                    Количество объектов с замечаниями
                  </Typography>
                  <Typography variant="h4">
                    {data.metrics.openIssues}
                  </Typography>
                </Stack>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <ArrowUp size={16} color="orange" />
                <Typography variant="body2" color="warning.main">
                  +12% увеличение по сравнению с прошлым месяцем
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* График и подписки */}
      <Grid container spacing={3} sx={{ mb: 4, width: "100%" }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <AppUsageChart data={data.chart} elevation={4} borderRadius={4} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={cardSx}>
            <CardHeader title="Сотрудники" />
            <CardContent>
              <List>
                {data.subscriptions.map((sub, index) => (
                  <Box key={index}>
                    <ListItem>
                      <ListItemText
                        primary={sub.name}
                        secondary={sub.price}
                        primaryTypographyProps={{ fontWeight: "medium" }}
                      />
                      <Typography
                        variant="body2"
                        color={
                          sub.status === "Работает"
                            ? "success.main"
                            : sub.status === "Командировка" ||
                                sub.status === "Отпуск"
                              ? "warning.main"
                              : "error.main"
                        }
                      >
                        {sub.status}
                      </Typography>
                    </ListItem>
                    {index < data.subscriptions.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
              <Button
                variant="text"
                endIcon={<ArrowRight />}
                sx={{ mt: 2 }}
                onClick={() => console.log("See all subscriptions")}
              >
                Подробнее...
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Чат, события и лимиты */}
      <Grid container spacing={3} sx={{ width: "100%" }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={cardSx}>
            <CardHeader title="Последние сообщения" />
            <CardContent>
              <List>
                {data.chat.map((chat, index) => (
                  <Box key={index}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>{chat.name[0]}</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={chat.name}
                        secondary={
                          <>
                            <Typography component="span" variant="body2">
                              {chat.message}
                            </Typography>
                            <br />
                            <Typography
                              component="span"
                              variant="caption"
                              color="text.secondary"
                            >
                              {chat.time}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    {index < data.chat.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
              <Button
                variant="text"
                endIcon={<ArrowRight />}
                sx={{ mt: 2 }}
                onClick={() => console.log("Go to chat")}
              >
                Подробнее...
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={cardSx}>
            <CardHeader title="План работы" />
            <CardContent>
              <List>
                {data.events.map((event, index) => (
                  <Box key={index}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: "primary.light" }}>
                          <Calendar />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="body1" fontWeight="medium">
                            {event.date} - {event.time}
                          </Typography>
                        }
                        secondary={event.title}
                      />
                    </ListItem>
                    {index < data.events.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
              <Button
                variant="text"
                endIcon={<ArrowRight />}
                sx={{ mt: 2 }}
                onClick={() => console.log("See all events")}
              >
                Посмотреть все события
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ ...cardSx, textAlign: "center" }}>
            <CardHeader title="Статус текущего задания" />
            <CardContent>
              <Box sx={{ position: "relative", display: "inline-flex", mb: 2 }}>
                <CircularProgress
                  variant="determinate"
                  value={data.appLimits}
                  size={100}
                  thickness={5}
                  sx={{ color: "primary.main" }}
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: "absolute",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="h6">{`${data.appLimits}%`}</Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Ожидается выгрузка отчета по проверке объекта №1
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Текущее задание выполнено на {data.appLimits}%.
              </Typography>
              <Button variant="contained" sx={{ mt: 2 }}>
                Подробнее...
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default DashboardPage;
