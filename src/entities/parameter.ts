// Основной интерфейс для параметра
export interface Parameter {
  id: number; // Уникальный идентификатор параметра
  name: string; // Название параметра (например, "Проверка температуры масла")
}

// Интерфейс для связи параметров с типами объектов (опционально, если нужно в будущем)
export interface ObjectTypeParameter {
  object_type_id: number; // ID типа объекта
  parameter_id: number; // ID параметра
}

// Расширенный интерфейс для параметров с дополнительными данными (если потребуется)
export interface ExtendedParameter extends Parameter {
  description?: string; // Описание параметра (опционально)
  is_required?: boolean; // Обязательность параметра (опционально)
}
