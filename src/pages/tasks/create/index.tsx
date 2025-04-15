// src/pages/tasks/create/index.tsx
import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Pagination,
  Select,
  Stack,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  StepConnector,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Close, ArrowBack, ArrowForward, Download } from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AssignmentAddIcon from "@mui/icons-material/AssignmentAdd";
import AssignmentIcon from "@mui/icons-material/Assignment";
import * as z from "zod";

// Кастомный StepConnector для устранения лишних линий
const CustomStepConnector = styled(StepConnector)(({ theme }) => ({
  "& .MuiStepConnector-line": {
    borderColor: theme.palette.grey[300],
    borderLeftWidth: 2,
    minHeight: "24px",
  },
  "&.Mui-active .MuiStepConnector-line": {
    borderColor: theme.palette.primary.main,
  },
  "&.Mui-completed .MuiStepConnector-line": {
    borderColor: theme.palette.primary.main,
  },
  "& .MuiStepConnector-lineVertical": {
    marginLeft: "12px", // Отступ для выравнивания линии
  },
  "& .MuiStepConnector-line::before, & .MuiStepConnector-line::after": {
    display: "none",
  },
}));

// Кастомный стиль для StepContent, чтобы убрать псевдоэлемент ::before
const CustomStepContent = styled(StepContent)({
  "&.MuiCollapse-root.MuiCollapse-entered::before": {
    display: "none", // Убираем псевдоэлемент ::before
  },
});

// Стили для карточки
const cardSx = {
  borderRadius: 2,
  boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
  bgcolor: "background.paper",
};

// Схема валидации формы
const taskSchema = z.object({
  objectId: z.string().min(1, "Выберите объект"),
  checkDate: z.any(),
  checkTime: z.any(),
  isRecheck: z.boolean(),
  lastCheckDate: z.any().optional(),
  operatorId: z.string().min(1, "Выберите оператора"),
  comment: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

const CreateTaskPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isObjectModalOpen, setIsObjectModalOpen] = useState(false);
  const [checkParams, setCheckParams] = useState<string[]>([]);
  const [isMismatchModalOpen, setIsMismatchModalOpen] = useState(false);
  const [xmlPassword, setXmlPassword] = useState(""); // Состояние для пароля XML

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      objectId: "",
      checkDate: null,
      checkTime: null,
      isRecheck: false,
      lastCheckDate: null,
      operatorId: "",
      comment: "",
    },
  });

  const formData = watch(); // Получаем данные формы для отчета

  const onSubmit = (data: TaskFormData) => {
    console.log("Form submitted:", { ...data, checkParams, xmlPassword });
  };

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const downloadPDF = () => {
    console.log("Downloading PDF...");
    // Здесь будет логика для скачивания PDF
  };

  const downloadXML = () => {
    console.log("Downloading XML with password:", xmlPassword);
    // Здесь будет логика для скачивания XML с использованием пароля
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          p: { xs: 2, sm: 3, md: 4 },

          minWidth: "1300px",
          mx: "auto",
          minHeight: "100vh",
        }}
      >
        <Grid container spacing={4}>
          <Card sx={cardSx}>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: "primary.main" }}>
                  <AssignmentAddIcon />
                </Avatar>
              }
              title="Создание задания"
              titleTypographyProps={{ variant: "h5", fontWeight: 600 }}
              subheaderTypographyProps={{
                variant: "body2",
                color: "text.secondary",
              }}
            />
            <CardContent>
              {/* Основная форма */}
              <Grid size={{ xs: 12, md: 12 }}>
                <Stack spacing={2}>
                  <Stepper
                    activeStep={activeStep}
                    orientation="vertical"
                    connector={<CustomStepConnector />}
                    sx={{
                      "& .MuiStepConnector-root": {
                        marginLeft: "12px", // Отступ для соединительной линии
                      },
                      "& .MuiStepConnector-line::before, & .MuiStepConnector-line::after":
                        {
                          display: "none",
                        },
                    }}
                  >
                    {/* Шаг 1 */}
                    <Step>
                      <StepLabel
                        StepIconComponent={() => (
                          <Avatar
                            sx={{
                              bgcolor:
                                activeStep >= 0 ? "primary.main" : "grey.300",
                            }}
                          >
                            1
                          </Avatar>
                        )}
                      >
                        <Typography variant="overline">
                          Основная информация
                        </Typography>
                      </StepLabel>
                      <CustomStepContent>
                        <form onSubmit={handleSubmit(onSubmit)}>
                          <Stack spacing={3}>
                            <Box>
                              <FormLabel>
                                <Typography variant="h6">
                                  Выберите объект
                                </Typography>
                              </FormLabel>
                              <Controller
                                name="objectId"
                                control={control}
                                render={({ field }) => (
                                  <FormControl
                                    fullWidth
                                    error={!!errors.objectId}
                                  >
                                    <InputLabel>Объект</InputLabel>
                                    <Select {...field} label="Объект">
                                      <MenuItem value="1">Объект 1</MenuItem>
                                      <MenuItem value="2">Объект 2</MenuItem>
                                      <MenuItem
                                        value="add"
                                        onClick={() =>
                                          setIsObjectModalOpen(true)
                                        }
                                      >
                                        Добавить новый объект
                                      </MenuItem>
                                    </Select>
                                    {errors.objectId && (
                                      <Typography color="error">
                                        {errors.objectId.message}
                                      </Typography>
                                    )}
                                  </FormControl>
                                )}
                              />
                            </Box>

                            <Grid container spacing={2}>
                              <Grid size={{ xs: 6 }}>
                                <Controller
                                  name="checkDate"
                                  control={control}
                                  render={({ field }) => (
                                    <DatePicker
                                      label="Дата проверки"
                                      value={field.value}
                                      onChange={field.onChange}
                                    />
                                  )}
                                />
                              </Grid>
                              <Grid size={{ xs: 6 }}>
                                <Controller
                                  name="checkTime"
                                  control={control}
                                  render={({ field }) => (
                                    <TimePicker
                                      label="Время начала"
                                      value={field.value}
                                      onChange={field.onChange}
                                    />
                                  )}
                                />
                              </Grid>
                            </Grid>

                            <Controller
                              name="isRecheck"
                              control={control}
                              render={({ field }) => (
                                <Stack spacing={2}>
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        {...field}
                                        checked={field.value}
                                      />
                                    }
                                    label="Повторная проверка"
                                  />
                                  {field.value && (
                                    <Controller
                                      name="lastCheckDate"
                                      control={control}
                                      render={({ field: dateField }) => (
                                        <DatePicker
                                          label="Дата последней проверки"
                                          value={dateField.value}
                                          onChange={dateField.onChange}
                                        />
                                      )}
                                    />
                                  )}
                                </Stack>
                              )}
                            />

                            <Box>
                              <FormLabel>
                                <Typography variant="h6">
                                  Выберите оператора
                                </Typography>
                              </FormLabel>
                              <Controller
                                name="operatorId"
                                control={control}
                                render={({ field }) => (
                                  <FormControl
                                    fullWidth
                                    error={!!errors.operatorId}
                                  >
                                    <InputLabel>Оператор</InputLabel>
                                    <Select {...field} label="Оператор">
                                      <MenuItem value="1">Иванов И.И.</MenuItem>
                                      <MenuItem value="2">Петров П.П.</MenuItem>
                                    </Select>
                                    {errors.operatorId && (
                                      <Typography color="error">
                                        {errors.operatorId.message}
                                      </Typography>
                                    )}
                                  </FormControl>
                                )}
                              />
                            </Box>

                            <Controller
                              name="comment"
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  label="Комментарий"
                                  multiline
                                  rows={4}
                                  fullWidth
                                />
                              )}
                            />

                            <Button
                              variant="contained"
                              onClick={handleNext}
                              disabled={!isValid}
                              endIcon={
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="1em"
                                  height="1em"
                                  fill="currentColor"
                                  viewBox="0 0 256 256"
                                >
                                  <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"></path>
                                </svg>
                              }
                            >
                              Далее
                            </Button>
                          </Stack>
                        </form>
                      </CustomStepContent>
                    </Step>

                    {/* Шаг 2 */}
                    <Step>
                      <StepLabel
                        StepIconComponent={() => (
                          <Avatar
                            sx={{
                              bgcolor:
                                activeStep >= 1 ? "primary.main" : "grey.300",
                            }}
                          >
                            2
                          </Avatar>
                        )}
                      >
                        <Typography variant="overline">
                          Параметры проверки
                        </Typography>
                      </StepLabel>
                      <CustomStepContent>
                        <Stack spacing={3}>
                          <Typography variant="h6">
                            Параметры проверки
                          </Typography>
                          <Stack spacing={1}>
                            {["Параметр 1", "Параметр 2", "Параметр 3"].map(
                              (param) => (
                                <FormControlLabel
                                  key={param}
                                  control={
                                    <Checkbox
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setCheckParams([
                                            ...checkParams,
                                            param,
                                          ]);
                                          setIsMismatchModalOpen(true);
                                        }
                                      }}
                                    />
                                  }
                                  label={param}
                                />
                              )
                            )}
                          </Stack>

                          <Grid container spacing={2}>
                            <Grid size={{ xs: 6 }}>
                              <TextField label="Поиск параметров" fullWidth />
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                              <Pagination count={10} />
                            </Grid>
                          </Grid>

                          <Stack direction="row" spacing={2}>
                            <TextField label="Новый параметр" fullWidth />
                            <Button variant="contained">Добавить</Button>
                          </Stack>

                          <Stack direction="row" spacing={2}>
                            <Button
                              variant="outlined"
                              onClick={handleBack}
                              startIcon={<ArrowBack />}
                            >
                              Назад
                            </Button>
                            <Button
                              variant="contained"
                              onClick={handleNext}
                              endIcon={
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="1em"
                                  height="1em"
                                  fill="currentColor"
                                  viewBox="0 0 256 256"
                                >
                                  <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"></path>
                                </svg>
                              }
                            >
                              Далее
                            </Button>
                          </Stack>
                        </Stack>
                      </CustomStepContent>
                    </Step>

                    {/* Шаг 3 */}
                    <Step>
                      <StepLabel
                        StepIconComponent={() => (
                          <Avatar
                            sx={{
                              bgcolor:
                                activeStep >= 2 ? "primary.main" : "grey.300",
                            }}
                          >
                            3
                          </Avatar>
                        )}
                      >
                        <Typography variant="overline">
                          Отчет по заданию
                        </Typography>
                      </StepLabel>
                      <CustomStepContent>
                        <Card elevation={1}>
                          <CardContent>
                            <Stack spacing={3}>
                              <Stack
                                direction="row"
                                justifyContent="space-between"
                              >
                                <Typography variant="h4">
                                  Отчет по заданию
                                </Typography>
                              </Stack>

                              <Stack spacing={1}>
                                <Stack direction="row" spacing={2}>
                                  <Typography variant="subtitle2">
                                    Дата проверки:
                                  </Typography>
                                  <Typography>
                                    {formData.checkDate
                                      ? formData.checkDate.format("DD.MM.YYYY")
                                      : "Не указана"}
                                  </Typography>
                                </Stack>
                                <Stack direction="row" spacing={2}>
                                  <Typography variant="subtitle2">
                                    Наименование объекта:
                                  </Typography>
                                  <Typography>
                                    {formData.objectId === "1"
                                      ? "Объект 1"
                                      : formData.objectId === "2"
                                        ? "Объект 2"
                                        : "Не указан"}
                                  </Typography>
                                </Stack>
                              </Stack>

                              <Grid container spacing={3}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                  <Stack spacing={1}>
                                    <Typography variant="subtitle1">
                                      Информация по объекту
                                    </Typography>
                                    <Typography variant="body2">
                                      Адрес: ул. Примерная, д. 123, г. Примерный
                                      <br />
                                      Полное наименование: ООО "Примерный
                                      объект"
                                      <br />
                                      Характеристики: Примерные характеристики
                                      объекта
                                    </Typography>
                                  </Stack>
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                  <Stack spacing={1}>
                                    <Typography variant="subtitle1">
                                      Оператор
                                    </Typography>
                                    <Typography variant="body2">
                                      {formData.operatorId === "1"
                                        ? "Иванов И.И."
                                        : formData.operatorId === "2"
                                          ? "Петров П.П."
                                          : "Не указан"}
                                      <br />
                                      Должность: Инспектор
                                      <br />
                                      Отдел: Отдел проверок
                                      <br />
                                      Телефон: +7 (123) 456-78-90
                                      <br />
                                      Email: example@company.com
                                    </Typography>
                                  </Stack>
                                </Grid>
                              </Grid>

                              <Stack spacing={1}>
                                <Typography variant="h6">
                                  Комментарий
                                </Typography>
                                <Typography variant="body2">
                                  {formData.comment ||
                                    "Комментарий отсутствует"}
                                </Typography>
                              </Stack>

                              <Stack spacing={1}>
                                <Typography variant="h6">
                                  Список параметров проверки
                                </Typography>
                                <Table>
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>Наименование</TableCell>
                                      <TableCell>Статус</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {checkParams.map((param, index) => (
                                      <TableRow key={index}>
                                        <TableCell>{param}</TableCell>
                                        <TableCell>Проверено</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </Stack>

                              <Stack direction="row" spacing={2}>
                                <Button
                                  variant="outlined"
                                  onClick={handleBack}
                                  startIcon={<ArrowBack />}
                                >
                                  Назад
                                </Button>
                                <Button
                                  variant="contained"
                                  onClick={handleNext}
                                  endIcon={<ArrowForward />}
                                >
                                  Далее
                                </Button>
                              </Stack>
                            </Stack>
                          </CardContent>
                        </Card>
                      </CustomStepContent>
                    </Step>

                    {/* Шаг 4 */}
                    <Step>
                      <StepLabel
                        StepIconComponent={() => (
                          <Avatar
                            sx={{
                              bgcolor:
                                activeStep >= 3 ? "primary.main" : "grey.300",
                            }}
                          >
                            4
                          </Avatar>
                        )}
                      >
                        <Typography variant="overline">
                          Сохранение и скачивание
                        </Typography>
                      </StepLabel>
                      <CustomStepContent>
                        <Stack spacing={3}>
                          <Typography variant="h6">
                            Сохранение и скачивание
                          </Typography>
                          <TextField
                            label="Пароль для XML-файла"
                            type="password"
                            value={xmlPassword}
                            onChange={(e) => setXmlPassword(e.target.value)}
                            fullWidth
                            helperText="Введите пароль для защиты XML-файла (опционально)"
                          />
                          <Button
                            variant="contained"
                            startIcon={<Download />}
                            onClick={downloadPDF}
                          >
                            Скачать отчет в PDF
                          </Button>
                          <Button
                            variant="contained"
                            startIcon={<Download />}
                            onClick={downloadXML}
                          >
                            Скачать задание в XML
                          </Button>
                          <Stack direction="row" spacing={2}>
                            <Button
                              variant="outlined"
                              onClick={handleBack}
                              startIcon={<ArrowBack />}
                            >
                              Назад
                            </Button>
                            <Button
                              variant="contained"
                              onClick={handleSubmit(onSubmit)}
                            >
                              Сохранить
                            </Button>
                          </Stack>
                        </Stack>
                      </CustomStepContent>
                    </Step>
                  </Stepper>
                </Stack>
              </Grid>
            </CardContent>
          </Card>

          {/* История проверок */}
          <Grid size={{ xs: 12, md: 12 }}>
            <Card elevation={1}>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: "primary.main" }}>
                    <AssignmentIcon />
                  </Avatar>
                }
                title="История проверок по объекту"
                titleTypographyProps={{ variant: "h6", fontWeight: 600 }}
                subheaderTypographyProps={{
                  variant: "body2",
                  color: "text.secondary",
                }}
              />
              <CardContent>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>№</TableCell>
                      <TableCell>Дата проверки</TableCell>
                      <TableCell>Повторная проверка</TableCell>
                      <TableCell>ФИО сотрудника</TableCell>
                      <TableCell>Комментарий</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* Здесь будет список истории из API */}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Модальное окно добавления объекта */}
        <Modal
          open={isObjectModalOpen}
          onClose={() => setIsObjectModalOpen(false)}
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              p: 4,
            }}
          >
            <Stack spacing={2}>
              <Typography variant="h6">Новый объект</Typography>
              <TextField label="Название объекта" fullWidth />
              <FormControl fullWidth>
                <InputLabel>Тип объекта</InputLabel>
                <Select label="Тип объекта">
                  <MenuItem value="boiler">Котельные</MenuItem>
                  <MenuItem value="tps">ТПС</MenuItem>
                  <MenuItem value="other">Другое</MenuItem>
                </Select>
              </FormControl>
              <TextField label="Характеристики" fullWidth multiline rows={2} />
              <FormControlLabel control={<Checkbox />} label="Действующий" />
              <Stack direction="row" spacing={2}>
                <Button variant="contained">Сохранить</Button>
                <IconButton onClick={() => setIsObjectModalOpen(false)}>
                  <Close />
                </IconButton>
              </Stack>
            </Stack>
          </Box>
        </Modal>

        {/* Модальное окно параметров несоответствия */}
        <Modal
          open={isMismatchModalOpen}
          onClose={() => setIsMismatchModalOpen(false)}
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              p: 4,
            }}
          >
            <Stack spacing={2}>
              <Typography variant="h6">Параметры несоответствия</Typography>
              <Stack spacing={1}>
                {["Несоответствие 1", "Несоответствие 2"].map((mismatch) => (
                  <FormControlLabel
                    key={mismatch}
                    control={<Checkbox />}
                    label={mismatch}
                  />
                ))}
              </Stack>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <TextField label="Поиск несоответствий" fullWidth />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Pagination count={10} />
                </Grid>
              </Grid>
              <Stack direction="row" spacing={2}>
                <TextField label="Новое несоответствие" fullWidth />
                <Button variant="contained">Добавить</Button>
              </Stack>
              <Button
                variant="contained"
                onClick={() => setIsMismatchModalOpen(false)}
              >
                Сохранить
              </Button>
            </Stack>
          </Box>
        </Modal>
      </Box>
    </LocalizationProvider>
  );
};

export default CreateTaskPage;
