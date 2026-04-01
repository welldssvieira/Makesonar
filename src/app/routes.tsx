import { createHashRouter } from "react-router";
import { TasksPage } from "./pages/tasks-page";
import { HistoryPage } from "./pages/history-page";

export const router = createHashRouter([
  {
    path: "/",
    Component: TasksPage,
  },
  {
    path: "/history",
    Component: HistoryPage,
  },
]);