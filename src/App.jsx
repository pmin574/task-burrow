import { useState, useEffect } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import { auth, loginWithGoogle, logout } from "./firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import {
  addTask,
  getTasks,
  clearTasks,
  deleteTask,
  updateTask, // New function for editing
} from "./services/taskService";
import "./styles/App.css";
import "./styles/Sidebar.css";
import logo from "./assets/TaskBurrow_Logo_PNG.png";
import TaskCreator from "./components/TaskCreator";
import TaskDisplay from "./components/TaskDisplay";
import LandingPage from "./pages/LandingPage";

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
    navigate("/"); // Redirects back to the Landing Page
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

  // 🔥 New Function: Handle Editing Tasks
  const handleEditTask = async (taskId, field, newValue) => {
    if (!user) return;

    try {
      await updateTask(user.uid, taskId, field, newValue); // Update in Firebase
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
    return <p>Loading...</p>;
  }

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <div className="sidebar">
        <img src={logo} alt="Task Burrow" className="logo" />
        {user && (
          <>
            <TaskCreator onTaskCreate={handleTaskCreate} />
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>

      {/* Main Content */}
      <div className="main-content">
        {user ? (
          <>
            <h2>Welcome, {user.displayName}</h2>
            {/* Pass new edit function to TaskDisplay */}
            <TaskDisplay
              tasks={tasks}
              onTaskDelete={handleDeleteMultipleTasks}
              onTaskEdit={handleEditTask} // Editing support
            />
          </>
        ) : (
          <Routes>
            <Route path="/" element={<LandingPage />} />
          </Routes>
        )}
      </div>
    </div>
  );
}

export default App;
