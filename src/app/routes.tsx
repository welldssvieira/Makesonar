import { createBrowserRouter } from "react-router";
import { TasksPage } from "./pages/tasks-page";
import { HistoryPage } from "./pages/history-page";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: TasksPage,
  },
  {
    path: "/history",
    Component: HistoryPage,
  },
]);
