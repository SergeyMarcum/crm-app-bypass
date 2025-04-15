export interface Check {
  id: number;
  checkDate: string; // ISO-дата, например, "2025-04-14"
  checkTime: string; // Время, например, "14:30"
  shift: "day" | "night"; // Смена
  operatorFullName: string; // ФИО оператора
  objectName: string; // Название объекта
  parameter: string; // Параметр проверки
  isCompliant: boolean; // Соответствует/не соответствует
  nonCompliance: string | null; // Несоответствие
  severity: "low" | "medium" | "high"; // Важность
  detectionType: string; // Тип обнаружения
  detectionDate: string; // Дата обнаружения
  resolutionDate: string | null; // Дата устранения
  comment: string | null; // Комментарий
  score: number; // Бальная оценка
  nonComplianceScore: number | null; // Оценка несоответствия
  master: string; // ФИО мастера
}
