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
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import { motion } from "framer-motion";
import CheckModal from "./CheckModal";
import { useCalendar } from "@/features/calendar/hooks/useCalendar";
import { Check } from "@/features/calendar/types";

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

// Кастомный toolbar с правильной типизацией
const CustomToolbar = ({
  label,
  onNavigate,
  onView,
}: ToolbarProps<CalendarEvent, object>) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      p: 2,
      flexWrap: "wrap",
      gap: 2,
    }}
  >
    <Typography variant="h6">{label}</Typography>
    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
      <Button variant="outlined" onClick={() => onNavigate("PREV")}>
        Назад
      </Button>
      <Button variant="outlined" onClick={() => onNavigate("TODAY")}>
        Сегодня
      </Button>
      <Button variant="outlined" onClick={() => onNavigate("NEXT")}>
        Вперёд
      </Button>
      <Button variant="contained" onClick={() => onView("month")}>
        Месяц
      </Button>
      <Button variant="contained" onClick={() => onView("week")}>
        Неделя
      </Button>
      <Button variant="contained" onClick={() => onView("day")}>
        День
      </Button>
      <Button variant="contained" onClick={() => onView("agenda")}>
        Повестка
      </Button>
    </Box>
  </Box>
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

  // Отладочный вывод для проверки данных
  console.log("Checks:", checks);
  console.log("Filters:", filters);

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

  console.log("Events:", events);

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
          ? "#1976d2" // Синий для запланированных
          : event.resource.status === "pending"
            ? "#ff9800" // Оранжевый для ожидаемых
            : event.resource.status === "overdue"
              ? "#d32f2f" // Красный для просроченных
              : "#4caf50", // Зелёный для проверенных
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

  // Кастомный рендер события с тултипом и анимацией
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
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Календарь работ - {dayjs(date).format("MMMM YYYY")}
      </Typography>
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
        <Button onClick={resetFilters}>Сбросить</Button>
      </Box>
      {isLoading && <CircularProgress />}
      {error && <Typography color="error">Ошибка: {error}</Typography>}
      {!isLoading && !error && (
        <>
          {events.length === 0 && (
            <Typography color="warning">Нет событий для отображения</Typography>
          )}
          <Calendar<CalendarEvent>
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 600 }}
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
      <CheckModal
        open={!!selectedCheck}
        onClose={() => setSelectedCheck(null)}
        check={selectedCheck}
      />
    </Box>
  );
};

export default CalendarPage;
