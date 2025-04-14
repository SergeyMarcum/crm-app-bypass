// src/styles/theme.ts
import { createTheme } from "@mui/material/styles";
import { indigo, purple, grey } from "@mui/material/colors";

// Функция для определения системной темы
const getSystemTheme = (): "light" | "dark" => {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

// Тип для темы
type ThemeMode = "light" | "dark" | "system";

export const getTheme = (theme: ThemeMode = "light") => {
  const mode = theme === "system" ? getSystemTheme() : theme;

  return createTheme({
    palette: {
      mode, // 'light' или 'dark'
      primary: {
        main: indigo[500], // Синий из макета Devias Kit
        light: indigo[300],
        dark: indigo[700],
        contrastText: "#ffffff", // Контрастный белый текст для кнопок
      },
      secondary: {
        main: purple[500], // Акцентный фиолетовый
        light: purple[300],
        dark: purple[700],
        contrastText: "#ffffff",
      },
      background: {
        default: mode === "light" ? grey[100] : "#121212", // Фон страницы
        paper: mode === "light" ? "#ffffff" : "#1e1e1e", // Фон карточек
      },
      text: {
        primary: mode === "light" ? grey[900] : "#ffffff", // Тёмный текст в светлом, белый в тёмном
        secondary: mode === "light" ? grey[600] : grey[400], // Второстепенный текст
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h4: {
        fontWeight: 700,
        fontSize: "2rem",
      },
      h6: {
        fontWeight: 600,
        fontSize: "1.25rem",
        color: mode === "light" ? grey[900] : "#ffffff", // Дублируем для надёжности
      },
      subtitle1: {
        fontWeight: 400,
        color: mode === "light" ? grey[600] : grey[400],
      },
      body1: {
        fontSize: "1rem",
      },
      body2: {
        fontSize: "0.875rem",
        color: mode === "light" ? grey[600] : grey[400],
      },
      overline: {
        fontSize: "0.75rem",
        fontWeight: 500,
        color: mode === "light" ? grey[600] : grey[400],
      },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow:
              mode === "light"
                ? "0px 4px 20px rgba(0, 0, 0, 0.1)"
                : "0px 4px 20px rgba(0, 0, 0, 0.3)",
            backgroundColor: mode === "light" ? "#ffffff" : "#1e1e1e",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            borderRadius: 8,
            padding: "8px 16px",
          },
          contained: {
            boxShadow: "none",
            "&:hover": {
              boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.15)",
            },
          },
          outlined: {
            borderColor: mode === "light" ? grey[300] : grey[700],
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: mode === "light" ? grey[100] : "#1e1e1e",
            borderRight:
              mode === "light" ? "1px solid #e0e0e0" : "1px solid #333",
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === "light" ? indigo[500] : indigo[900],
            color: "#ffffff",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            color: mode === "light" ? grey[900] : "#ffffff", // Устанавливаем цвет по умолчанию
          },
          overline: {
            color: mode === "light" ? grey[600] : grey[400],
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            backgroundColor: mode === "light" ? grey[200] : grey[800],
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 6,
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 12,
            backgroundColor: mode === "light" ? "#ffffff" : "#1e1e1e",
          },
        },
      },
    },
  });
};

export default getTheme;
