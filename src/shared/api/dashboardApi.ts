import axios from "axios";

export const fetchDashboardData = async () => {
  // Мок-данные, позже заменишь на реальный запрос к FastAPI
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve({
        metrics: { tickets: 31, signUps: 240, openIssues: 21 },
        chart: [
          { month: "Янв", thisYear: 400, lastYear: 240 },
          { month: "Фев", thisYear: 300, lastYear: 139 },
          { month: "Мар", thisYear: 200, lastYear: 180 },
          { month: "Апр", thisYear: 278, lastYear: 90 },
          { month: "Май", thisYear: 189, lastYear: 110 },
          { month: "Июн", thisYear: 239, lastYear: 180 },
          { month: "Июл", thisYear: 349, lastYear: 230 },
          { month: "Авг", thisYear: 200, lastYear: 50 },
          { month: "Сен", thisYear: 278, lastYear: 190 },
          { month: "Окт", thisYear: 189, lastYear: 180 },
          { month: "Ноя", thisYear: 239, lastYear: 180 },
          { month: "Дек", thisYear: 349, lastYear: 130 },
        ],
        subscriptions: [
          { name: "На рабочем месте", price: "115", status: "Работает" },
          {
            name: "Находятся в командировке",
            price: "3",
            status: "Командировка",
          },
          {
            name: "Находятся на лечении в связи со временной нетрудоспособностью",
            price: "10",
            status: "Больничный",
          },
          { name: "Находятся в отпуске", price: "15", status: "Отпуск" },
          { name: "Уволенные сотрудники", price: "4", status: "Уволен(а)" },
        ],
        chat: [
          {
            name: "Мастер 1",
            message: "Здравствуйте, необходимо загрузить отчет до 01.04",
            time: "2 мин. назад",
          },
          {
            name: "Мастер 1",
            message: "Здравствуйте, необходимо проверить объект №4",
            time: "2 часа назад",
          },
          {
            name: "Мастер 2",
            message: "Здравствуйте, необходимо проверить объект №3",
            time: "3 часов назад",
          },
          {
            name: "Мастер 2",
            message: "Здравствуйте, необходимо проверить объект №2",
            time: "8 часов назад",
          },
        ],
        events: [
          {
            date: "МАР 28",
            time: "08:00",
            title: "Проверка объекта №1",
          },
          {
            date: "МАР 31",
            time: "10:45",
            title: "Проверка объекта №2",
          },
          { date: "МАР 31", time: "23:30", title: "Проверка объекта №3" },
          { date: "АПР 3", time: "09:00", title: "Проверка объекта №4" },
        ],
        appLimits: 80,
      });
    }, 1000)
  );
};
