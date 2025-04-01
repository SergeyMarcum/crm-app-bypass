import React, { useState } from "react";
import { Calendar, dayjsLocalizer, Views, View } from "react-big-calendar"; // Добавлен импорт View
import dayjs from "dayjs";
import "dayjs/locale/ru";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  DialogActions,
  Button,
} from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

dayjs.locale("ru");
const localizer = dayjsLocalizer(dayjs);

interface CheckEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  status?: "planned" | "pending" | "overdue" | "completed";
  userAvatar?: string;
  details?: CheckDetail[];
}

interface CheckDetail {
  objectName: string;
  status: "planned" | "pending" | "overdue" | "completed";
  remarks?: boolean;
}

const events: CheckEvent[] = [
  {
    id: 1,
    title: "Завод №1",
    start: new Date(2025, 3, 1, 14, 0),
    end: new Date(2025, 3, 1, 15, 0),
    status: "planned",
    userAvatar:
      "https://img.freepik.com/free-photo/cute-cat-studio_23-2150932371.jpg?t=st=1743490231~exp=1743493831~hmac=fad6f1518d6d9043f0c476dd75de4f9578187a26e8f99bde381de3310375fcc3&w=996",
  },
  {
    id: 2,
    title: "4 объекта",
    start: new Date(2025, 3, 2, 9, 0),
    end: new Date(2025, 3, 2, 17, 0),
    details: [
      { objectName: "Склад №1", status: "completed", remarks: false },
      { objectName: "Склад №2", status: "completed", remarks: true },
      { objectName: "Офис №1", status: "pending" },
      { objectName: "Офис №2", status: "overdue" },
    ],
  },
];

const CalendarPage: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<CheckEvent | null>(null);
  const [view, setView] = useState<View>(Views.MONTH); // Используем тип View
  const [date, setDate] = useState(new Date(2025, 3, 1));

  const eventStyleGetter = (event: CheckEvent) => {
    const style = {
      backgroundColor: event.status
        ? event.status === "planned"
          ? "#e0e0e0"
          : event.status === "pending"
            ? "#fff3cd"
            : event.status === "overdue"
              ? "#f8d7da"
              : "#d4edda"
        : "#e0e0e0",
      borderRadius: "3px",
      color: "black",
      border: "none",
    };
    return { style };
  };

  const handleSelectEvent = (event: CheckEvent) => {
    setSelectedEvent(event);
  };

  const handleClose = () => {
    setSelectedEvent(null);
  };

  const handleNavigate = (newDate: Date) => {
    setDate(newDate);
  };

  const columnDefs: ColDef<CheckDetail>[] = [
    { headerName: "Объект", field: "objectName" },
    {
      headerName: "Статус",
      field: "status",
      valueFormatter: (params) =>
        params.value === "planned"
          ? "Запланировано"
          : params.value === "pending"
            ? "Ожидается"
            : params.value === "overdue"
              ? "Просрочено"
              : "Проверено",
    },
    {
      headerName: "Замечания",
      field: "remarks",
      valueFormatter: (params) => (params.value ? "Да" : "Нет"),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        {dayjs(date).format("MMMM YYYY")}
      </Typography>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        view={view}
        onView={setView} // Теперь тип совместим
        date={date}
        onNavigate={handleNavigate}
        eventPropGetter={eventStyleGetter}
        onSelectEvent={handleSelectEvent}
        messages={{
          next: "Следующий",
          previous: "Предыдущий",
          today: "Сегодня",
          month: "Месяц",
          week: "Неделя",
          day: "День",
        }}
      />
      <Dialog
        open={!!selectedEvent}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
      >
        {selectedEvent && (
          <>
            <DialogTitle>
              {selectedEvent.details
                ? `Проверки за ${dayjs(selectedEvent.start).format("DD MMMM YYYY")}`
                : selectedEvent.title}
            </DialogTitle>
            <DialogContent>
              {selectedEvent.details ? (
                <div>
                  <Typography>
                    Всего запланировано: {selectedEvent.details.length}
                  </Typography>
                  <Typography>
                    Режим ожидания:{" "}
                    {
                      selectedEvent.details.filter(
                        (d) => d.status === "planned"
                      ).length
                    }
                  </Typography>
                  <Typography>
                    Ожидает загрузки:{" "}
                    {
                      selectedEvent.details.filter(
                        (d) => d.status === "pending"
                      ).length
                    }
                  </Typography>
                  <Typography>
                    Проверено:{" "}
                    {
                      selectedEvent.details.filter(
                        (d) => d.status === "completed"
                      ).length
                    }
                  </Typography>
                  <Typography>
                    Без замечаний:{" "}
                    {
                      selectedEvent.details.filter(
                        (d) => d.status === "completed" && !d.remarks
                      ).length
                    }
                  </Typography>
                  <Typography>
                    С недостатками:{" "}
                    {
                      selectedEvent.details.filter(
                        (d) => d.status === "completed" && d.remarks
                      ).length
                    }
                  </Typography>
                  <Typography>
                    Просрочено:{" "}
                    {
                      selectedEvent.details.filter(
                        (d) => d.status === "overdue"
                      ).length
                    }
                  </Typography>
                  <div
                    className="ag-theme-alpine"
                    style={{ height: 300, width: "100%", marginTop: 20 }}
                  >
                    <AgGridReact
                      rowData={selectedEvent.details}
                      columnDefs={columnDefs}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <Typography>Объект: {selectedEvent.title}</Typography>
                  <Typography>
                    Время: {dayjs(selectedEvent.start).format("HH:mm")}
                  </Typography>
                  <Typography>
                    Статус:{" "}
                    {selectedEvent.status === "planned"
                      ? "Запланировано"
                      : selectedEvent.status === "pending"
                        ? "Ожидается"
                        : selectedEvent.status === "overdue"
                          ? "Просрочено"
                          : "Проверено"}
                  </Typography>
                  {selectedEvent.userAvatar && (
                    <img
                      src={selectedEvent.userAvatar}
                      alt="User"
                      style={{ width: 40, height: 40, borderRadius: "50%" }}
                    />
                  )}
                </div>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Закрыть
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </div>
  );
};

export default CalendarPage;
