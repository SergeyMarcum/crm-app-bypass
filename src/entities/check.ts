export interface Check {
  id: number;
  checkDate: string; // Дата проверки
  checkTime: string; // Время проверки
  shift: "day" | "night" | ""; // Смена
  operatorName: string; // ФИО оператора
  objectName: string; // Объект
  parameter: string; // Параметр проверки
  isCompliant: boolean | null; // Проверка (да/нет)
  nonCompliance: string; // Несоответствие
  severity: string; // Важность
  detectionType: string; // Тип обнаружения
  detectionDate: string; // Дата обнаружения
  resolutionDate: string; // Дата устранения
  comment: string; // Комментарий
  score: number | null; // Бальная оценка
  nonComplianceScore: number | null; // Бальная оценка несоответствия
  master: string; // Мастер
}
