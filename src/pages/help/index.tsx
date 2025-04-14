// src/pages/help/index.tsx
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Button,
  Card,
  CardHeader,
  CardContent,
  TextField,
  Box,
  MenuItem,
  Typography,
} from "@mui/material";
import { helpApi } from "@/shared/api/helpApi";

// Схема валидации с Zod
const schema = z.object({
  subject: z.string().min(1, "Тема обязательна"),
  type: z.enum(["Ошибка в работе", "Предложение", "Другое"], {
    errorMap: () => ({ message: "Выберите тип запроса" }),
  }),
  name: z.string().min(1, "Имя обязательно"),
  message: z.string().min(10, "Сообщение должно содержать минимум 10 символов"),
});

type FormData = z.infer<typeof schema>;

const HelpPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await helpApi.sendSupportRequest(data);
      alert("Запрос успешно отправлен!");
    } catch {
      alert("Ошибка при отправке запроса. Попробуйте позже.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 3,
      }}
    >
      <Card sx={{ maxWidth: 600, width: "100%" }}>
        <CardHeader title="Нужна помощь?" />
        <CardContent>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            У вас есть вопросы по работе данной системы? Заполните форму, и наш
            сотрудник свяжется с вами в ближайшее время.
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="Тема"
              {...register("subject")}
              error={!!errors.subject}
              helperText={errors.subject?.message}
              fullWidth
            />
            <TextField
              label="Тип запроса"
              {...register("type")}
              error={!!errors.type}
              helperText={errors.type?.message}
              select
              fullWidth
            >
              <MenuItem value="Ошибка в работе">Ошибка в работе</MenuItem>
              <MenuItem value="Предложение">Предложение</MenuItem>
              <MenuItem value="Другое">Другое</MenuItem>
            </TextField>
            <TextField
              label="Имя"
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
              fullWidth
            />
            <TextField
              label="Сообщение"
              {...register("message")}
              error={!!errors.message}
              helperText={errors.message?.message}
              multiline
              rows={4}
              fullWidth
            />
            <Button type="submit" variant="contained" color="primary">
              Отправить
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default HelpPage;
