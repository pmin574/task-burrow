import { createBrowserRouter } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import TaskCreator from "./components/TaskCreator";
import TaskDisplay from "./components/TaskDisplay";
import CalendarPage from "./pages/CalendarPage";
import InsightsPage from "./pages/InsightsPage";
import KanbanBoardPage from "./pages/KanbanBoardPage";

const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/create-task", element: <TaskCreator /> },
  { path: "/tasks", element: <TaskDisplay /> },
  { path: "/calendar", element: <CalendarPage /> },
  { path: "/insights", element: <InsightsPage /> }, // ✅ Added Insights page
  { path: "/kanban", element: <KanbanBoardPage /> }, // ✅ Added Kanban Board page
]);

export default router;
