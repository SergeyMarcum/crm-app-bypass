import { z } from "zod";

// Схема для пользователя
export const userSchema = z.object({
  id: z.number(),
  full_name: z.string().nullable(),
  email: z.string().email().nullable(),
  role_id: z.number(),
  status_id: z.number(),
  domain: z.string().nullable(),
  name: z.string(),
  position: z.string().nullable(),
  department: z.string().nullable(),
  phone: z.string().nullable(),
});

export type User = z.infer<typeof userSchema>;

export const usersSchema = z.array(userSchema);

// Схема для статистики дашборда
export const dashboardStatsSchema = z.object({
  count_objects: z.number(),
  count_checked: z.number(),
  count_issues: z.number(),
});

export type DashboardStats = z.infer<typeof dashboardStatsSchema>;

// Схема для задачи
export const taskSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  status: z.string(),
  created_at: z.string(),
});

export type Task = z.infer<typeof taskSchema>;

export const tasksSchema = z.array(taskSchema);
