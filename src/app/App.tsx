import React, { useEffect } from "react";
import { ReactRouterAppProvider } from "@toolpad/core/react-router";
import { Outlet } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { getTheme } from "@/styles/theme";
import { useAuthStore } from "@/features/auth/store";

export default function App() {
  const [currentTheme, setCurrentTheme] = React.useState(getTheme());

  // Подписываемся на изменения темы в сторе
  useEffect(() => {
    const unsubscribe = useAuthStore.subscribe(() => {
      setCurrentTheme(getTheme());
    });
    return () => unsubscribe();
  }, []);

  return (
    <ThemeProvider theme={currentTheme}>
      <ReactRouterAppProvider theme={currentTheme}>
        <Outlet />
      </ReactRouterAppProvider>
    </ThemeProvider>
  );
}
