import { useState, useEffect } from "react";
import { useNavigate, Routes, Route } from "react-router-dom"; // ✅ Use Routes & Route
import { auth, loginWithGoogle, logout } from "./firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { addTask, getTasks } from "./services/taskService";
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

  if (user === undefined) {
    return <p>Loading...</p>;
  }

  return (
    <div className="app-container">
      {/* 
      <img src={logo} alt="Task Burrow" className="spinning-logo" /> 
      */}

      {user ? (
        <>
          <p>Welcome, {user.displayName}</p>
          <button onClick={handleLogout}>Logout</button>
          <TaskCreator onTaskCreate={handleTaskCreate} />
          <TaskDisplay tasks={tasks} />
        </>
      ) : (
        <Routes> {/* ✅ Use Routes here instead of RouterProvider */}
          <Route path="/" element={<LandingPage />} />
        </Routes>
      )}
    </div>
  );
}

export default App;
