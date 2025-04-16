import { useState } from "react";
import {
  Calendar,
  dayjsLocalizer,
  ToolbarProps,
  Views,
  View,
} from "react-big-calendar";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Box,
  Stack,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Tooltip,
  Card,
  CardHeader,
  CardContent,
  Avatar,
} from "@mui/material";
import { motion } from "framer-motion";
import CheckModal from "./CheckModal";
import { useCalendar } from "@/features/calendar/hooks/useCalendar";
import { Check } from "@/features/calendar/types";
import {
  CalendarMonth as CalendarIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Today as TodayIcon,
} from "@mui/icons-material";

// Настройка локалайзера с dayjs
dayjs.locale("ru");
const localizer = dayjsLocalizer(dayjs);

// Интерфейс для события календаря
interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  resource: Check;
}

// Стили для карточки
const cardSx = {
  borderRadius: 2,
  boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
  bgcolor: "background.paper",
};

// Кастомный toolbar
const CustomToolbar = ({
  label,
  onNavigate,
  onView,
  view,
}: ToolbarProps<CalendarEvent, object>) => (
  <Stack
    direction={{ xs: "column", sm: "row" }}
    spacing={2}
    sx={{ p: 2, justifyContent: "space-between", alignItems: "center" }}
  >
    <Typography variant="subtitle1">{label}</Typography>
    <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={() => onNavigate("PREV")}
      >
        Назад
      </Button>
      <Button
        variant="outlined"
        startIcon={<TodayIcon />}
        onClick={() => onNavigate("TODAY")}
      >
        Сегодня
      </Button>
      <Button
        variant="outlined"
        startIcon={<ArrowForwardIcon />}
        onClick={() => onNavigate("NEXT")}
      >
        Вперёд
      </Button>
      <Button
        variant={view === "month" ? "contained" : "outlined"}
        onClick={() => onView("month")}
      >
        Месяц
      </Button>
      <Button
        variant={view === "week" ? "contained" : "outlined"}
        onClick={() => onView("week")}
      >
        Неделя
      </Button>
      <Button
        variant={view === "day" ? "contained" : "outlined"}
        onClick={() => onView("day")}
      >
        День
      </Button>
      <Button
        variant={view === "agenda" ? "contained" : "outlined"}
        onClick={() => onView("agenda")}
      >
        Повестка
      </Button>
    </Stack>
  </Stack>
);

const CalendarPage = () => {
  const {
    filters,
    setFilters,
    checks,
    isLoading,
    error,
    objects,
    operators,
    resetFilters,
  } = useCalendar();
  const [selectedCheck, setSelectedCheck] = useState<Check | null>(null);
  const [view, setView] = useState<View>(Views.MONTH);
  const [date, setDate] = useState(new Date(2025, 3, 1));

  // Отладочный вывод
  console.log("Checks:", checks);
  console.log("Filters:", filters);
  console.log("Error:", error);

  const events: CalendarEvent[] = checks.map((check) => {
    const start = new Date(check.startTime);
    console.log(
      `Event ${check.id} startTime:`,
      check.startTime,
      "Parsed:",
      start
    );
    return {
      id: check.id,
      title: check.objectName,
      start,
      end: start,
      resource: check,
    };
  });

  const handleSelectEvent = (event: CalendarEvent) => {
    console.log("Selected event:", event);
    setSelectedCheck(event.resource);
  };

  const handleNavigate = (newDate: Date) => {
    setDate(newDate);
  };

  const handleFilterChange = (
    field: keyof typeof filters,
    value: string | number | null
  ) => {
    setFilters({ ...filters, [field]: value });
  };

  // Кастомизация стилей событий
  const eventStyleGetter = (event: CalendarEvent) => {
    const isOverdue = event.resource.status === "overdue";
    const style = {
      backgroundColor:
        event.resource.status === "planned"
          ? "#1976d2"
          : event.resource.status === "pending"
            ? "#ff9800"
            : event.resource.status === "overdue"
              ? "#d32f2f"
              : "#4caf50",
      color: "white",
      borderRadius: "4px",
      border: "none",
      padding: isOverdue ? "2px 8px 2px 24px" : "2px 8px",
      fontSize: "14px",
      position: "relative" as const,
      cursor: "pointer",
      ...(isOverdue && {
        "&:before": {
          content: '"⚠"',
          position: "absolute",
          left: "8px",
          top: "50%",
          transform: "translateY(-50%)",
          fontSize: "16px",
        },
      }),
    };
    return { style };
  };

  // Кастомный рендер события
  const eventRenderer = ({ event }: { event: CalendarEvent }) => (
    <Tooltip
      title={`Объект: ${event.title}, Оператор: ${event.resource.operator.fullName}, Статус: ${event.resource.status}`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        style={{ cursor: "pointer", width: "100%", height: "100%" }}
        onClick={() => handleSelectEvent(event)}
      >
        <Box sx={{ display: "flex", flexDirection: "column", p: 0.5 }}>
          <Typography variant="caption" color="inherit">
            {event.title}
          </Typography>
          <Typography variant="caption" color="inherit">
            {event.resource.operator.fullName}
          </Typography>
        </Box>
      </motion.div>
    </Tooltip>
  );

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },

        minWidth: "1400px",
        mx: "auto",
        minHeight: "100vh",
      }}
    >
      <Card sx={cardSx}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: "primary.main" }}>
              <CalendarIcon />
            </Avatar>
          }
          title="Календарь работ"
          titleTypographyProps={{ variant: "h5", fontWeight: 600 }}
          subheader={dayjs(date).format("MMMM YYYY")}
          subheaderTypographyProps={{
            variant: "body2",
            color: "text.secondary",
          }}
        />
        <CardContent>
          <Box sx={{ display: "flex", gap: 2, my: 2, flexWrap: "wrap" }}>
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Статус</InputLabel>
              <Select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
              >
                <MenuItem value="all">Все</MenuItem>
                <MenuItem value="planned">Запланировано</MenuItem>
                <MenuItem value="pending">Ожидается</MenuItem>
                <MenuItem value="overdue">Просрочено</MenuItem>
                <MenuItem value="completed">Проверено</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Объект</InputLabel>
              <Select
                value={filters.objectId || ""}
                onChange={(e) =>
                  handleFilterChange("objectId", e.target.value || null)
                }
              >
                <MenuItem value="">Все</MenuItem>
                {objects.map((obj) => (
                  <MenuItem key={obj.id} value={obj.id}>
                    {obj.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Оператор</InputLabel>
              <Select
                value={filters.operatorId || ""}
                onChange={(e) =>
                  handleFilterChange("operatorId", e.target.value || null)
                }
              >
                <MenuItem value="">Все</MenuItem>
                {operators.map((op) => (
                  <MenuItem key={op.id} value={op.id}>
                    {op.fullName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button onClick={resetFilters} variant="outlined">
              Сбросить
            </Button>
          </Box>
          {isLoading && <CircularProgress />}
          {error && <Typography color="error">Ошибка: {error}</Typography>}
          {!isLoading && !error && (
            <>
              {events.length === 0 && (
                <Typography color="warning">
                  Нет событий для отображения
                </Typography>
              )}
              <Calendar<CalendarEvent>
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 800 }}
                view={view}
                onView={setView}
                date={date}
                onNavigate={handleNavigate}
                eventPropGetter={eventStyleGetter}
                components={{
                  event: eventRenderer,
                  toolbar: CustomToolbar,
                }}
                onSelectEvent={handleSelectEvent}
                messages={{
                  today: "Сегодня",
                  previous: "Назад",
                  next: "Вперёд",
                  month: "Месяц",
                  week: "Неделя",
                  day: "День",
                  agenda: "Повестка",
                  date: "Дата",
                  time: "Время",
                  event: "Событие",
                  noEventsInRange: "Нет событий в этом диапазоне",
                  showMore: (total: number) => `+ ещё ${total}`,
                }}
              />
            </>
          )}
        </CardContent>
      </Card>
      <CheckModal
        open={!!selectedCheck}
        onClose={() => setSelectedCheck(null)}
        check={selectedCheck}
      />
    </Box>
  );
};

export default CalendarPage;
