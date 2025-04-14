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
  Button,
  CircularProgress,
  Stack,
  CardHeader,
} from "@mui/material";
import Grid from "@mui/material/Grid"; // Grid v2 в MUI v7
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ArrowUp, Lightning } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
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

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1300, mx: "auto" }}>
      {/* Метрики */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent sx={{ py: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Количество объектов
              </Typography>
              <Typography variant="h5" sx={{ mb: 1 }}>
                {data.metrics.tickets}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <ArrowUp size={16} color="green" />
                <Typography variant="caption" color="success.main">
                  +15% увеличение по сравнению с прошлым месяцем
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent sx={{ py: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Количество проверенных объектов
              </Typography>
              <Typography variant="h5" sx={{ mb: 1 }}>
                {data.metrics.signUps}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <ArrowUp
                  size={16}
                  color="red"
                  style={{ transform: "rotate(180deg)" }}
                />
                <Typography variant="caption" color="error.main">
                  -5% снижение по сравнению с прошлым месяцем
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent sx={{ py: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Количество объектов с замечаниями
              </Typography>
              <Typography variant="h5" sx={{ mb: 1 }}>
                {data.metrics.openIssues}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <ArrowUp size={16} color="orange" />
                <Typography variant="caption" color="warning.main">
                  +12% увеличение по сравнению с прошлым месяцем
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* График */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardHeader
              title="App usage"
              subheader={
                <Stack spacing={1}>
                  <Typography variant="h6" color="success.main">
                    +28%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    increase in app usage with 6,527 new products purchased
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    This year is forecasted to increase by the end of the
                    current month
                  </Typography>
                </Stack>
              }
              subheaderTypographyProps={{ color: "text.secondary" }}
            />
            <CardContent>
              <AppUsageChart data={data.chart} />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardHeader title="Our subscriptions" />
            <CardContent>
              <List>
                {data.subscriptions.map((sub, index) => (
                  <ListItem key={index} sx={{ py: 1 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: "primary.light" }}>
                        {sub.name[0]}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={sub.name}
                      secondary={sub.price}
                      primaryTypographyProps={{ fontWeight: "medium" }}
                    />
                    <Typography
                      variant="caption"
                      color={
                        sub.status === "Payd"
                          ? "success.main"
                          : sub.status === "Expiring"
                            ? "warning.main"
                            : "error.main"
                      }
                    >
                      {sub.status}
                    </Typography>
                  </ListItem>
                ))}
              </List>
              <Button
                component={Link}
                to="/subscriptions"
                variant="text"
                endIcon={<ArrowRight />}
              >
                See all subscriptions
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Чат, события и лимиты */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardHeader title="App chat" />
            <CardContent>
              <List>
                {data.chat.map((chat, index) => (
                  <ListItem key={index} sx={{ py: 0.5 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ width: 32, height: 32 }}>
                        {chat.name[0]}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="body2" fontWeight="medium">
                          {chat.name}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography variant="caption">
                            {chat.message}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            component="p"
                          >
                            {chat.time}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
              <Button
                component={Link}
                to="/messages"
                variant="text"
                endIcon={<ArrowRight />}
              >
                Go to chat
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardHeader title="Upcoming events" />
            <CardContent>
              <List>
                {data.events.map((event, index) => (
                  <ListItem key={index} sx={{ py: 0.5 }}>
                    <ListItemText
                      primary={
                        <Typography variant="body2" fontWeight="medium">
                          {event.date}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography variant="caption">
                            {event.time}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            component="p"
                          >
                            {event.title}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
              <Button
                component={Link}
                to="/tasks/control"
                variant="text"
                endIcon={<ArrowRight />}
              >
                See all events
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderRadius: 3, boxShadow: 3, textAlign: "center" }}>
            <CardHeader title="App limits" />
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
              <Typography variant="body2" fontWeight="medium" gutterBottom>
                You’ve almost reached your limit
              </Typography>
              <Typography variant="caption" color="text.secondary" gutterBottom>
                You have used 80% of your available spots. Upgrade plan to get
                more.
              </Typography>
              <Box mt={2}>
                <Button
                  variant="contained"
                  startIcon={<Lightning />}
                  sx={{ bgcolor: "primary.main", color: "white" }}
                >
                  Upgrade plan
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default DashboardPage;
