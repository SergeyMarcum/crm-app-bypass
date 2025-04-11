// Интерфейс задачи
export interface Task {
  id: string | number; // Уникальный идентификатор задания
  user_id: number; // ID пользователя
  object_id: number; // ID объекта
  shift_id: number; // ID смены (1 - дневная, 2 - ночная)
  checking_type_id: number; // ID типа проверки (1 - первичная, 2 - повторная)
  checking_type_text: string | null; // Текст типа проверки
  date_time: string; // Дата и время выполнения
  domain: string | null; // Домен задания
  date_for_search: string | null; // Дата для поиска
  status?: string; // Статус задания (например, "Не начато")
}

// Ответ от API с задачами
export interface TaskResponse {
  tasks: Task[]; // Массив задач
  total: number; // Общее количество задач для пагинации
}
