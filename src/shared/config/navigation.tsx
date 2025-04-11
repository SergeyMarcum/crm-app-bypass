// src/shared/config/navigation.ts
import DashboardIcon from "@mui/icons-material/Dashboard";
import EventNoteIcon from "@mui/icons-material/EventNote";
import AssignmentIcon from "@mui/icons-material/Assignment";
import GroupIcon from "@mui/icons-material/Group";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import MailIcon from "@mui/icons-material/Mail";
import BookIcon from "@mui/icons-material/Book";
import SettingsIcon from "@mui/icons-material/Settings";
import SupportIcon from "@mui/icons-material/Support";
import LogoutIcon from "@mui/icons-material/Logout";

// Определяем тип Navigation вручную
export type Navigation = Array<
  | { kind: "header"; title: string }
  | { kind: "divider" }
  | {
      segment?: string;
      title: string;
      icon?: React.ReactNode;
      children?: Array<{
        segment?: string;
        title: string;
        icon?: React.ReactNode;
      }>;
    }
>;

export const NAVIGATION: Navigation = [
  // Группа "Основное" (прижата к верху)
  {
    kind: "header",
    title: "Основное",
  },
  {
    segment: "",
    title: "Главная",
    icon: <DashboardIcon />,
  },
  {
    segment: "calendar",
    title: "Календарь работ",
    icon: <EventNoteIcon />,
  },
  {
    segment: "tasks",
    title: "Задания",
    icon: <AssignmentIcon />,
    children: [
      {
        segment: "create",
        title: "Создать",
      },
      {
        segment: "view",
        title: "Просмотр",
      },
      {
        segment: "control",
        title: "Контроль",
      },
    ],
  },
  {
    segment: "employees",
    title: "Список сотрудников",
    icon: <GroupIcon />,
  },
  {
    segment: "users",
    title: "Список пользователей",
    icon: <ManageAccountsIcon />,
  },
  {
    segment: "logs",
    title: "Журналы",
    icon: <AutoStoriesIcon />,
    children: [
      {
        segment: "checks",
        title: "Журнал проверок",
      },
      {
        segment: "defects",
        title: "Журнал дефектов",
      },
    ],
  },
  {
    segment: "messages",
    title: "Сообщения",
    icon: <MailIcon />,
  },

  // Пространство между группами (будет растягиваться)
  {
    kind: "divider",
  },

  // Группа "Дополнительно" (прижата к низу)
  {
    kind: "header",
    title: "Дополнительно",
  },
  {
    segment: "instructions",
    title: "Инструкции",
    icon: <BookIcon />,
  },
  {
    segment: "settings",
    title: "Настройки",
    icon: <SettingsIcon />,
  },
  {
    segment: "help",
    title: "Нужна помощь?",
    icon: <SupportIcon />,
  },
  {
    segment: "logout",
    title: "Выход",
    icon: <LogoutIcon />,
  },
];
