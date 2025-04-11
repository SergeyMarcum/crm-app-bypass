// src/entities/user.ts
export interface User {
  id: number;
  login?: string; // "login" из ответа API
  system_login?: string; // "system_login" из ответа API
  full_name: string | null; // Полное имя пользователя, может быть null, "full_name" из ответа API
  company: string | null; // Название филиала, необязательное поле "company" из ответа API
  email: string | null; // Электронная почта, может быть null, "email" из ответа API
  role_id: number; // Идентификатор прав доступа  (обязательное поле)
  status_id: number | null; // Идентификатор статуса, может быть null
  domain: string; // Домен пользователя (обязательное поле)
  position: string | null; // Должность, необязательное поле, "position" из ответа API
  department: string | null; // Отдел, может быть null, "department" из ответа API
  phone: string | null; // Телефон, необязательное поле, "phone" из ответа API
  name: string; // Имя пользователя (обязательное поле)
  title?: string; // Заголовок/должность (опционально)
  bio?: string; // Биография (опционально)
  theme?: "light" | "dark" | "system"; // Тема оформления (опционально)
  publicContact?: boolean; // Доступность контакта публично (опционально)
  availableToHire?: boolean;
  token?: string; // Токен авторизации (опционально, используется в некоторых контекстах)
  address?: string | null; // Добавлено для адреса
  avatar?: string; // Добавляем поле avatar
  status?: string; // Добавляем поле status
}

export interface UserResponse {
  users: User[]; // Массив пользователей
  departments: string[]; // Список отделов
}

export interface LoginUser {
  id: number; // Идентификатор пользователя
  username: string; // Имя пользователя для входа
  password: string; // Пароль (в реальном коде не хранится в открытом виде)
  domain: string; // Домен для авторизации
  token: string; // Токен, возвращаемый после успешного входа
}
