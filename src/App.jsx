import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { auth, onAuthStateChanged, logout } from "./firebaseConfig";
import {
  addTask,
  getTasks,
  clearTasks,
  deleteTask,
  updateTask,
} from "./services/taskService";
import "./styles/App.css";
import "./styles/Sidebar.css";
import logo from "./assets/TaskBurrow_Logo_PNG.png";
import TaskCreator from "./components/TaskCreator";
import TaskDisplay from "./components/TaskDisplay";
import LandingPage from "./pages/LandingPage";
import CalendarPage from "./pages/CalendarPage";
import InsightsPage from "./pages/InsightsPage";
import KanbanBoardPage from "./pages/KanbanBoardPage";
import { CircularProgress } from "@mui/material";

function DashboardLayout() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (auth.currentUser) {
      fetchTasks();
    }
  }, [auth.currentUser]);

  const fetchTasks = async () => {
    if (!auth.currentUser) return;
    const fetchedTasks = await getTasks(auth.currentUser.uid);
    setTasks(fetchedTasks);
  };

  const handleDeleteMultipleTasks = async (taskIds) => {
    if (!auth.currentUser || taskIds.length === 0) return;

    try {
      // Delete tasks in Firebase
      for (const taskId of taskIds) {
        await deleteTask(auth.currentUser.uid, taskId);
      }

      // Update UI
      setTasks((prevTasks) =>
        prevTasks.filter((task) => !taskIds.includes(task.id))
      );
    } catch (error) {
      console.error("Error deleting tasks:", error);
    }
  };

  const handleTaskCreate = async (newTask) => {
    if (!auth.currentUser) return;
    const taskWithId = await addTask(auth.currentUser.uid, newTask);
    if (taskWithId) {
      setTasks((prevTasks) => [...prevTasks, taskWithId]);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="app-layout">
      <div className="sidebar">
        <img src={logo} alt="Task Burrow" className="logo" />
        <TaskCreator onTaskCreate={handleTaskCreate} />

        {/* 🔥 Burrows Section for Navigation */}
        <div className="burrows-box">
          <h3>Burrows</h3>
          <button onClick={() => navigate("/calendar")}>📅 Calendar</button>
          <button onClick={() => navigate("/insights")}>📊 Insights</button>
          <button onClick={() => navigate("/kanban")}>🗂️ Kanban Board</button>
        </div>

        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="main-content">
        <h2>Welcome, {auth.currentUser?.displayName}</h2>
        <TaskDisplay tasks={tasks} onTaskDelete={handleDeleteMultipleTasks} />
      </div>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser || null);
    });

    return () => unsubscribe();
  }, []);

  if (user === undefined) {
    return (
      <div className="loading-container">
        <CircularProgress size={60} />
        <p>Loading your tasks...</p>
      </div>
    );
  }

  return (
    <Routes>
      {/* Full-Screen Pages */}
      <Route path="/calendar" element={<CalendarPage />} />
      <Route path="/insights" element={<InsightsPage />} />
      <Route path="/kanban" element={<KanbanBoardPage />} />

      {/* Dashboard Layout */}
      <Route path="/" element={user ? <DashboardLayout /> : <LandingPage />} />
    </Routes>
  );
}

export default App;
