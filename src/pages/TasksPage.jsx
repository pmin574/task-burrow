import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, onAuthStateChanged } from "../firebaseConfig";
import { addTask, getTasks, deleteTask } from "../services/taskService";
import TaskCreator from "../components/TaskCreator";
import TaskDisplay from "../components/TaskDisplay";

const TasksPage = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        navigate("/"); // Redirect if not authenticated
      } else {
        fetchTasks(firebaseUser.uid);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchTasks = async (userId) => {
    if (!userId) return;
    const fetchedTasks = await getTasks(userId);
    setTasks(fetchedTasks);
  };

  const handleTaskCreate = async (newTask) => {
    if (!auth.currentUser) return;
    const taskWithId = await addTask(auth.currentUser.uid, newTask);
    if (taskWithId) {
      setTasks((prevTasks) => [...prevTasks, taskWithId]);
    }
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

  return (
    <div className="tasks-container">
      <button className="back-button" onClick={() => navigate("/dashboard")}>
        ⬅️ Back to Dashboard
      </button>

      <h2>📋 Tasks</h2>
      <TaskCreator onTaskCreate={handleTaskCreate} />
      <TaskDisplay tasks={tasks} onTaskDelete={handleDeleteMultipleTasks} />
    </div>
  );
};

export default TasksPage;
