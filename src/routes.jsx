import { createBrowserRouter } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import CalendarPage from "./pages/CalendarPage";
import InsightsPage from "./pages/InsightsPage";
import KanbanBoardPage from "./pages/KanbanBoardPage";
import Dashboard from "./pages/Dashboard";
import TasksPage from "./pages/TasksPage";

const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/calendar", element: <CalendarPage /> },
  { path: "/insights", element: <InsightsPage /> },
  { path: "/kanban", element: <KanbanBoardPage /> },
  { path: "/tasks", element: <TasksPage /> },
]);

export default router;
