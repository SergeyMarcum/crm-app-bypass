// Основной интерфейс для несоответствия
export interface NonCompliance {
  id: number; // Уникальный идентификатор несоответствия
  name: string; // Название несоответствия (например, "Треснула обшивка")
}

// Интерфейс для связи несоответствий с параметрами
export interface ParameterNonCompliance {
  id: number; // Уникальный идентификатор связи
  incongruity_id: number; // ID несоответствия (ссылка на NonCompliance)
  parameter_id: number; // ID параметра (ссылка на Parameter)
}

// Расширенный интерфейс для несоответствия с дополнительными данными (если потребуется)
export interface ExtendedNonCompliance extends NonCompliance {
  description?: string; // Описание несоответствия (опционально)
  severity?: string; // Уровень серьезности (например, "низкий", "высокий")
  created_at?: string; // Дата создания (опционально)
}
