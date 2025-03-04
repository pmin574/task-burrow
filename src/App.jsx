import { useState, useEffect } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import { auth, loginWithGoogle, logout } from "./firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import {
  addTask,
  getTasks,
  clearTasks,
  deleteTask,
} from "./services/taskService";
import "./styles/App.css";
import "./styles/Logo.css";
import "./styles/Sidebar.css"; // Add a new CSS file for the sidebar
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
    navigate("/");
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
            <TaskDisplay tasks={tasks} onTaskDelete={deleteTask} />
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
