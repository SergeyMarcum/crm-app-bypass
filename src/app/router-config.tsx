// src/app/router-config.tsx
import React, { lazy } from "react";
import { createBrowserRouter, Outlet } from "react-router-dom";

import Layout from "@/widgets/layout/Layout";
import DashboardLayout from "@/widgets/layout/DashboardLayout";
import { ProtectedRoute, LogoutRoute } from "./routes";
import ErrorPage from "@/pages/ErrorPage";

const LoginPage = lazy(() => import("@/pages/login"));
const DashboardPage = lazy(() => import("@/pages/dashboard"));
const CalendarPage = lazy(() => import("@/pages/calendar"));
const TasksCreatePage = lazy(() => import("@/pages/tasks/create"));
const TasksViewPage = lazy(() => import("@/pages/tasks/view"));
const TasksControlPage = lazy(() => import("@/pages/tasks/control"));
const EmployeesPage = lazy(() => import("@/pages/employees"));
const UsersPage = lazy(() => import("@/pages/users"));
const LogsChecksPage = lazy(() => import("@/pages/logs/checks"));
const LogsDefectsPage = lazy(() => import("@/pages/logs/defects"));
const MessagesPage = lazy(() => import("@/pages/messages"));
const InstructionsPage = lazy(() => import("@/pages/instructions"));
const SettingsPage = lazy(() => import("@/pages/settings"));
const HelpPage = lazy(() => import("@/pages/help"));
const App = lazy(() => import("@/app/App"));

export const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <Layout>
        <React.Suspense fallback={<div>Загрузка...</div>}>
          <LoginPage />
        </React.Suspense>
      </Layout>
    ),
  },
  {
    path: "/",
    element: (
      <React.Suspense fallback={<div>Загрузка...</div>}>
        <App />
      </React.Suspense>
    ),
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            element: <div>Перенаправление на дашборд...</div>,
          },
          {
            element: (
              <DashboardLayout>
                <React.Suspense fallback={<div>Загрузка...</div>}>
                  <Outlet />
                </React.Suspense>
              </DashboardLayout>
            ),
            children: [
              {
                path: "dashboard",
                element: <DashboardPage />,
              },
              {
                path: "calendar",
                element: <CalendarPage />,
              },
              {
                path: "tasks",
                children: [
                  {
                    path: "create",
                    element: <TasksCreatePage />,
                  },
                  {
                    path: "view",
                    element: <TasksViewPage />,
                  },
                  {
                    path: "control",
                    element: <TasksControlPage />,
                  },
                  {
                    path: "control/:id",
                    element: <div>Страница просмотра задания (TODO)</div>,
                  },
                ],
              },
              {
                path: "employees",
                element: <EmployeesPage />,
              },
              {
                path: "users",
                element: <UsersPage />,
              },
              {
                path: "logs",
                children: [
                  {
                    path: "checks",
                    element: <LogsChecksPage />,
                  },
                  {
                    path: "defects",
                    element: <LogsDefectsPage />,
                  },
                ],
              },
              {
                path: "messages",
                element: <MessagesPage />,
              },
              {
                path: "instructions",
                element: <InstructionsPage />,
              },

              {
                path: "settings",
                element: <SettingsPage />,
                errorElement: <ErrorPage />, // Компонент для отображения ошибок
              },
              {
                path: "settings/user/:userId",
                element: <SettingsPage />,
                errorElement: <ErrorPage />,
              },
              {
                path: "help",
                element: <HelpPage />,
              },
            ],
          },
          {
            path: "*",
            element: <div>404 - Страница не найдена</div>,
          },
        ],
      },
      {
        path: "logout",
        element: <LogoutRoute />,
      },
    ],
  },
]);
