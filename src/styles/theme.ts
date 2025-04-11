// src/styles/theme.ts
import { createTheme } from "@mui/material/styles";
import { useAuthStore } from "@/features/auth/store";

// Функция для определения системной темы
const getSystemTheme = (): "light" | "dark" => {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export const getTheme = () => {
  const { theme } = useAuthStore.getState();
  const mode = theme === "system" ? getSystemTheme() : theme || "light";

  return createTheme({
    palette: {
      mode, // "light" или "dark"
      primary: {
        main: "#3f51b5", // Основной цвет (синий)
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#f50057", // Вторичный цвет (розовый)
        contrastText: "#ffffff",
      },
      background: {
        default: mode === "light" ? "#fafafb" : "#121212", // Фон приложения
        paper: mode === "light" ? "#ffffff" : "#1e1e1e", // Фон панелей
      },
      text: {
        primary: mode === "light" ? "#212121" : "#ffffff",
        secondary: mode === "light" ? "#757575" : "#b0bec5",
      },
    },
    components: {
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: mode === "light" ? "#fafafb" : "#1e1e1e", // Фон боковой панели
            borderRight:
              mode === "light" ? "1px solid #e0e0e0" : "1px solid #333",
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: "#3f51b5", // Совпадает с primary.main
            color: "#ffffff",
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          overline: {
            color: mode === "light" ? "#757575" : "#b0bec5", // Цвет заголовков групп
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            backgroundColor: mode === "light" ? "#e0e0e0" : "#424242", // Цвет разделителя
          },
        },
      },
    },
  });
};

export default getTheme;
