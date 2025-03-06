import React, { useEffect, useState } from "react";
import TaskDisplay from "../components/TaskDisplay";
import { getTasks, deleteTask } from "../services/taskService";
import { auth, onAuthStateChanged } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";

const TaskListPage = () => {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        navigate("/"); // Redirect to login if not authenticated
      } else {
        setUser(firebaseUser);
        fetchTasks(firebaseUser.uid);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // 🔥 Fetch tasks in real-time
  const fetchTasks = async (userId) => {
    if (!userId) return;
    console.log("Fetching tasks for user:", userId); // Debugging
    const fetchedTasks = await getTasks(userId);
    console.log("Fetched tasks:", fetchedTasks); // Debugging
    setTasks(fetchedTasks);
  };

  // 🔥 Handle deleting tasks with real-time update
  const handleDeleteMultipleTasks = async (taskIds) => {
    if (!user || taskIds.length === 0) return;
    try {
      for (const taskId of taskIds) {
        await deleteTask(user.uid, taskId);
      }
      setTasks((prevTasks) =>
        prevTasks.filter((task) => !taskIds.includes(task.id))
      );
    } catch (error) {
      console.error("Error deleting tasks:", error);
    }
  };

  return (
    <div>
      <h2>📋 Task List</h2>
      {!user ? (
        <p>Loading...</p>
      ) : tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <TaskDisplay tasks={tasks} onTaskDelete={handleDeleteMultipleTasks} />
      )}
    </div>
  );
};

export default TaskListPage;
