import { useState, useEffect } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import { auth, loginWithGoogle, logout } from "./firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
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

function App() {
  const [user, setUser] = useState(undefined);
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser || null);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    if (!user) return;
    const fetchedTasks = await getTasks(user.uid);
    setTasks(fetchedTasks);
  };

  const handleTaskCreate = async (newTask) => {
    if (!user) return;
    const taskWithId = await addTask(user.uid, newTask);
    if (taskWithId) {
      setTasks((prevTasks) => [...prevTasks, taskWithId]);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setTasks([]);
    navigate("/");
  };

  const handleDeleteMultipleTasks = async (taskIds) => {
    if (!user || taskIds.length === 0) return;

    for (const taskId of taskIds) {
      await deleteTask(user.uid, taskId);
    }

    setTasks((prevTasks) =>
      prevTasks.filter((task) => !taskIds.includes(task.id))
    );
  };

  const handleEditTask = async (taskId, field, newValue) => {
    if (!user) return;

    try {
      await updateTask(user.uid, taskId, field, newValue);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, [field]: newValue } : task
        )
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  if (user === undefined) {
    return (
      <div className="loading-container">
        <CircularProgress size={60} />
        <p>Loading your tasks...</p>
      </div>
    );
  }

  return (
    <div className="app-layout">
      {user && (
        <div className="sidebar">
          <img src={logo} alt="Task Burrow" className="logo" />
          <TaskCreator onTaskCreate={handleTaskCreate} />

          {/* 🔥 Burrows Section with New Pages */}
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
      )}

      <div className="main-content">
        {user ? (
          <>
            <h2>Welcome, {user.displayName}</h2>
            <TaskDisplay
              tasks={tasks}
              onTaskDelete={handleDeleteMultipleTasks}
              onTaskEdit={handleEditTask}
            />
          </>
        ) : (
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="/kanban" element={<KanbanBoardPage />} />
          </Routes>
        )}
      </div>
    </div>
  );
}

export default App;
