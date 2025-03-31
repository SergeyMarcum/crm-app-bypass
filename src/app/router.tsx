import { createBrowserRouter } from "react-router-dom";
import { DashboardPage } from "../pages/dashboard";
import { LoginPage } from "../pages/login";
import { CalendarPage } from "../pages/calendar";
import { TasksCreatePage } from "../pages/tasks/create";
import { TasksViewPage } from "../pages/tasks/view";
import { TasksControlPage } from "../pages/tasks/control";
import { EmployeesPage } from "../pages/employees";
import { UsersPage } from "../pages/users";
import { LogsChecksPage } from "../pages/logs/checks";
import { LogsDefectsPage } from "../pages/logs/defects";
import { MessagesPage } from "../pages/messages";
import { InstructionsPage } from "../pages/instructions";
import { SettingsPage } from "../pages/settings";
import { HelpPage } from "../pages/help";
import Layout from "../widgets/layout/Layout";
import App from "./App";

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
      { path: "", element: <DashboardPage /> },
      { path: "calendar", element: <CalendarPage /> },
      {
        path: "tasks",
        children: [
          { path: "create", element: <TasksCreatePage /> },
          { path: "view", element: <TasksViewPage /> },
          { path: "control", element: <TasksControlPage /> },
        ],
      },
      { path: "employees", element: <EmployeesPage /> },
      { path: "users", element: <UsersPage /> },
      {
        path: "logs",
        children: [
          { path: "checks", element: <LogsChecksPage /> },
          { path: "defects", element: <LogsDefectsPage /> },
        ],
      },
      { path: "messages", element: <MessagesPage /> },
      { path: "instructions", element: <InstructionsPage /> },
      { path: "settings", element: <SettingsPage /> },
      { path: "help", element: <HelpPage /> },
    ],
  },
]);
