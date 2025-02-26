import { createBrowserRouter } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import TaskCreator from "./components/TaskCreator";
import TaskDisplay from "./components/TaskDisplay";

const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/create-task", element: <TaskCreator /> },
  { path: "/tasks", element: <TaskDisplay /> },

  // Future pages (commented out for now)
  // { path: "/dashboard", element: <Dashboard /> },
  // { path: "/login", element: <Login /> },
  // { path: "/signup", element: <Signup /> },
]);

export default router;
