import { createBrowserRouter, Navigate } from "react-router-dom";
import { useAuthStore } from "../features/auth/store";
import DashboardLayout from "../widgets/layout/DashboardLayout";
import Layout from "../widgets/layout/Layout";
import LoginPage from "../pages/login";
import DashboardPage from "../pages/dashboard";
import CalendarPage from "../pages/calendar";
import TasksCreatePage from "../pages/tasks/create";
import TasksViewPage from "../pages/tasks/view";
import TasksControlPage from "../pages/tasks/control";
import EmployeesPage from "../pages/employees";
import UsersPage from "../pages/users";
import LogsChecksPage from "../pages/logs/checks";
import LogsDefectsPage from "../pages/logs/defects";
import MessagesPage from "../pages/messages";
import InstructionsPage from "../pages/instructions";
import SettingsPage from "../pages/settings";
import HelpPage from "../pages/help";
import App from "./App";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isTestMode = useAuthStore((state) => state.isTestMode);

  if (isAuthenticated || isTestMode) {
    return <DashboardLayout>{children}</DashboardLayout>;
  }
  return <Navigate to="/login" replace />;
};

const LogoutRoute = () => {
  const { logout } = useAuthStore();
  logout();
  return <Navigate to="/login" replace />;
};

export const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <Layout>
        <LoginPage />
      </Layout>
    ),
  },
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <Navigate to="/dashboard" replace />
          </ProtectedRoute>
        ),
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "calendar",
        element: (
          <ProtectedRoute>
            <CalendarPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "tasks",
        children: [
          {
            path: "create",
            element: (
              <ProtectedRoute>
                <TasksCreatePage />
              </ProtectedRoute>
            ),
          },
          {
            path: "view",
            element: (
              <ProtectedRoute>
                <TasksViewPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "control",
            element: (
              <ProtectedRoute>
                <TasksControlPage />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: "employees",
        element: (
          <ProtectedRoute>
            <EmployeesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "users",
        element: (
          <ProtectedRoute>
            <UsersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "logs",
        children: [
          {
            path: "checks",
            element: (
              <ProtectedRoute>
                <LogsChecksPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "defects",
            element: (
              <ProtectedRoute>
                <LogsDefectsPage />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: "messages",
        element: (
          <ProtectedRoute>
            <MessagesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "instructions",
        element: (
          <ProtectedRoute>
            <InstructionsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "settings",
        element: (
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "help",
        element: (
          <ProtectedRoute>
            <HelpPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "logout",
        element: <LogoutRoute />,
      },
      {
        path: "*",
        element: (
          <ProtectedRoute>
            <div>404 - Страница не найдена</div>
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
