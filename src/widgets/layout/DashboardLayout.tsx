import { DashboardLayout as ToolpadDashboardLayout } from "@toolpad/core/DashboardLayout";
import { NAVIGATION } from "../../shared/config/navigation";
import ToolbarActions from "../toolbar/ToolbarActions";
import { Link } from "react-router-dom";
import { Path } from "@phosphor-icons/react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToolpadDashboardLayout
      navigation={NAVIGATION}
      slots={{
        toolbarActions: ToolbarActions,
      }}
      branding={{
        logo: (
          <Link to="/">
            <Path size={45} color="#fff" />
          </Link>
        ),
        title: "Обходчик",
      }}
      sx={{
        "& .MuiAppBar-root": {
          backgroundColor: "#1976D2", // Тёмный фон, как в примере
          boxShadow:
            "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)", // Тень elevation={4}
          color: "#ffffff", // Белый цвет текста и иконок
        },
        "& .MuiToolbar-root": {
          padding: "0 24px", // Отступы внутри Toolbar, как в примере
          minHeight: 64, // Высота шапки
        },
        "& .MuiTypography-h6": {
          fontSize: "1.5rem", // Размер шрифта, как в примере
          fontWeight: 500, // Средний вес шрифта
          color: "#ffffff", // Белый цвет для названия приложения
          marginLeft: "10px", // Отступ от логотипа
        },
        "& .MuiIconButton-root": {
          color: "#ffffff", // Белый цвет для иконок
        },
      }}
    >
      {children}
    </ToolpadDashboardLayout>
  );
}
