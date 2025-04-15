// src/pages/tasks/view/index.tsx
import React from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Container,
} from "@mui/material";
import { useParams } from "react-router-dom";

import { useTask } from "@/features/tasks/hooks/useTask";
import dayjs from "dayjs";
import { Chat } from "@/features/tasks/components/Chat";

const TaskViewPage: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const { task, loading } = useTask(taskId);

  if (loading) {
    return <Box>Loading...</Box>;
  }

  if (!task) {
    return <Box>Task not found</Box>;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box
        sx={{
          p: { xs: 2, sm: 3, md: 4 },

          minWidth: "1300px",
          mx: "auto",
          minHeight: "100vh",
        }}
      >
        <Stack spacing={3}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h4">Задание по проверке объекта</Typography>
            <Stack direction="row" spacing={2}>
              <Button variant="outlined" color="primary">
                Загрузить отчет
              </Button>
              <Button variant="contained" color="primary">
                Сохранить
              </Button>
            </Stack>
          </Stack>

          <Stack spacing={1}>
            <Typography variant="body1">
              <strong>Дата начала:</strong>{" "}
              {dayjs(task.startDate).format("DD.MM.YYYY")}
            </Typography>
            <Typography variant="body1">
              <strong>Время начала:</strong>{" "}
              {dayjs(task.startDate).format("HH:mm")}
            </Typography>
            <Typography variant="body1">
              <strong>Дата загрузки отчета:</strong>{" "}
              {task.reportDate
                ? dayjs(task.reportDate).format("DD.MM.YYYY")
                : "Нет"}
            </Typography>
            <Typography variant="body1">
              <strong>Повторная проверка:</strong>{" "}
              {task.isRecheck ? "Да" : "Нет"}
              {task.isRecheck && task.lastCheckDate && (
                <>
                  {" "}
                  (Последняя проверка:{" "}
                  {dayjs(task.lastCheckDate).format("DD.MM.YYYY")})
                </>
              )}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={3}>
            <Paper
              elevation={0}
              sx={{ p: 2, flex: 1, border: "1px solid #e0e0e0" }}
            >
              <Typography variant="h6">Объект</Typography>
              <Stack spacing={1}>
                <Typography variant="body1">
                  <strong>IT NYC</strong>
                </Typography>
                <Typography variant="body2">
                  Brooklyn, New York, United States
                </Typography>
                <Typography variant="body2">
                  Полное название объекта: IT NYC 360
                </Typography>
                <Typography variant="body2">
                  Характеристики объекта: Построен в 2005 года, белая отделка
                </Typography>
              </Stack>
            </Paper>

            <Paper
              elevation={0}
              sx={{ p: 2, flex: 1, border: "1px solid #e0e0e0" }}
            >
              <Typography variant="h6">Оператор</Typography>
              <Stack spacing={1}>
                <Typography variant="body1">
                  <strong>Иванов Иван Иванович</strong>
                </Typography>
                <Typography variant="body2">Отдел: IT</Typography>
                <Typography variant="body2">Должность: Инженер</Typography>
                <Typography variant="body2">Email: ivanov@itnyc.com</Typography>
                <Typography variant="body2">Телефон: 8-352-44-60-44</Typography>
              </Stack>
            </Paper>
          </Stack>

          <Box>
            <Typography variant="h6" mb={2}>
              Параметры проверки объекта
            </Typography>
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{ border: "1px solid #e0e0e0" }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>№</TableCell>
                    <TableCell>Наименование параметра проверки</TableCell>
                    <TableCell>Соответствует / не соответствует</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {task.parameters.map((param, index) => (
                    <TableRow key={param.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{param.name}</TableCell>
                      <TableCell>
                        {param.isCompliant
                          ? "Соответствует"
                          : "Не соответствует"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Box>
            <Typography variant="h6" mb={2}>
              История проверки
            </Typography>
            <Chat />
          </Box>
        </Stack>
      </Box>
    </Container>
  );
};

export default TaskViewPage;
