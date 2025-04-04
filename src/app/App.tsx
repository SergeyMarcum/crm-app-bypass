import { ReactRouterAppProvider } from "@toolpad/core/react-router";
import { Outlet } from "react-router-dom";
import { NAVIGATION } from "../shared/config/navigation";
import theme from "../styles/theme";

export default function App() {
  return (
    <ReactRouterAppProvider navigation={NAVIGATION} theme={theme}>
      <Outlet />
    </ReactRouterAppProvider>
  );
}
