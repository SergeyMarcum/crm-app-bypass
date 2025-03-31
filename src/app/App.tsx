import { ReactRouterAppProvider } from "@toolpad/core/react-router";
import { Outlet } from "react-router-dom";
import DashboardLayout from "../widgets/layout/DashboardLayout";
import { NAVIGATION } from "../shared/config/navigation";
import theme from "../styles/theme"; // Импортируем кастомную тему

export default function App() {
  return (
    <ReactRouterAppProvider navigation={NAVIGATION} theme={theme}>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </ReactRouterAppProvider>
  );
}
