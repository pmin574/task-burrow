import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, onAuthStateChanged, logout } from "../firebaseConfig";
import { addTask, getTasks, deleteTask } from "../services/taskService";
import "../styles/Sidebar.css";
import logo from "../assets/TaskBurrow_Logo_PNG.png";
import TaskCreator from "../components/TaskCreator";
import TaskDisplay from "../components/TaskDisplay";

function Dashboard() {
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
      for (const taskId of taskIds) {
        await deleteTask(auth.currentUser.uid, taskId);
      }
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

        {/* 🔥 Burrows Section for Navigation */}
        <div className="burrows-box">
          <h3>Burrows</h3>
          <button onClick={() => navigate("/calendar")}>📅 Calendar</button>
          <button onClick={() => navigate("/insights")}>📊 Insights</button>
          <button onClick={() => navigate("/kanban")}>🗂️ Kanban Board</button>
          <button onClick={() => navigate("/tasks")}>📋 Tasks</button>
        </div>

        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="main-content empty-dashboard">
        <h2>Welcome, {auth.currentUser?.displayName}</h2>
        <p>Select a section to manage your tasks.</p>
      </div>
    </div>
  );
}

export default Dashboard;
