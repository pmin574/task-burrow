import { useState, useEffect } from "react";
import { useNavigate, Routes, Route } from "react-router-dom"; // ✅ Use Routes & Route
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
import logo from "./assets/TaskBurrow_Logo_PNG.png";
import TaskCreator from "./components/TaskCreator";
import TaskDisplay from "./components/TaskDisplay";
import LandingPage from "./pages/LandingPage"; // ✅ Import LandingPage

function App() {
  const [user, setUser] = useState(undefined);
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate(); // ✅ Now this works properly

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
    navigate("/"); // ✅ Redirects back to the Landing Page
  };

  const handleClearTasks = async () => {
    if (!user) return;
    // Delete tasks from Firestore
    await clearTasks(user.uid);
    // Clear the tasks from the UI
    setTasks([]);
  };

  const handleDeleteTask = async (taskId) => {
    if (!user) return;
    await deleteTask(user.uid, taskId);
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  if (user === undefined) {
    return <p>Loading...</p>;
  }

  return (
    <div className="app-container">
      <img src={logo} alt="Task Burrow" className="spinning-logo" />

      {user ? (
        <>
          <p>Welcome, {user.displayName}</p>
          <button onClick={handleLogout}>Logout</button>
          <TaskCreator onTaskCreate={handleTaskCreate} />
          <button onClick={handleClearTasks}>Clear Tasks</button>
          <TaskDisplay
            tasks={tasks}
            // if you have a toggle handler
            onTaskDelete={handleDeleteTask} // this enables individual task deletion
          />
        </>
      ) : (
        <Routes>
          <Route path="/" element={<LandingPage />} />
        </Routes>
      )}
    </div>
  );
}

export default App;
