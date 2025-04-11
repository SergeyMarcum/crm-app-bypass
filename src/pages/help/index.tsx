// src/pages/help/index.tsx
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button, TextField, Box } from "@mui/material";
import { helpApi } from "@/shared/api/helpApi"; // Предполагаемый API-файл

const schema = z.object({
  subject: z.string().min(1, "Тема обязательна"),
  type: z.enum(["Ошибка в работе", "Предложение", "Другое"]),
  name: z.string().min(1, "Имя обязательно"),
  message: z.string().min(10, "Сообщение слишком короткое"),
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
    await helpApi.sendSupportRequest(data); // Используем реальный эндпоинт
    alert("Запрос отправлен!");
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 2 }}>
      <TextField
        label="Тема"
        {...register("subject")}
        error={!!errors.subject}
        helperText={errors.subject?.message}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Тип запроса"
        {...register("type")}
        error={!!errors.type}
        helperText={errors.type?.message}
        select
        SelectProps={{ native: true }}
        fullWidth
        margin="normal"
      >
        <option value="Ошибка в работе">Ошибка в работе</option>
        <option value="Предложение">Предложение</option>
        <option value="Другое">Другое</option>
      </TextField>
      <TextField
        label="Имя"
        {...register("name")}
        error={!!errors.name}
        helperText={errors.name?.message}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Сообщение"
        {...register("message")}
        error={!!errors.message}
        helperText={errors.message?.message}
        multiline
        rows={4}
        fullWidth
        margin="normal"
      />
      <Button type="submit" variant="contained" color="primary">
        Отправить
      </Button>
    </Box>
  );
};

export default HelpPage;
