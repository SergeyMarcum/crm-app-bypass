// Интерфейс сотрудника
export interface Employee {
  id: number; // Уникальный идентификатор сотрудника
  full_name: string; // Полное имя сотрудника
  email: string | null; // Электронная почта
  position: string | null; // Должность
  department: string | null; // Отдел
  phone: string | null; // Телефон
  hire_date: string; // Дата найма (ISO-формат)
  status: "active" | "inactive" | "on_leave"; // Статус сотрудника
  manager_id: number | null; // ID руководителя, может быть null
  status_id?: string | number; // Добавляем status_id
  avatar?: string; // Добавляем avatar
}

// Ответ от API с сотрудниками
export interface EmployeeResponse {
  employees: Employee[]; // Массив сотрудников
  total: number; // Общее количество сотрудников
}
