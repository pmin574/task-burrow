import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, onAuthStateChanged } from "../firebaseConfig";
import {
  addTask,
  getTasks,
  deleteTask,
  updateTask,
} from "../services/taskService";
import TaskCreator from "../components/TaskCreator";
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Checkbox,
  TextField,
  InputAdornment,
  Divider,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as UncheckedIcon,
} from "@mui/icons-material";
import "../styles/TasksPage.css";

const TasksPage = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState("all"); // all, active, completed

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        navigate("/");
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

  const handleDeleteTask = async (taskId) => {
    if (!auth.currentUser) return;
    try {
      await deleteTask(auth.currentUser.uid, taskId);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleToggleComplete = async (taskId) => {
    if (!auth.currentUser) return;
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const newStatus = task.status === "done" ? "todo" : "done";
    try {
      await updateTask(auth.currentUser.uid, taskId, { status: newStatus });
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === taskId ? { ...t, status: newStatus } : t
        )
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleEditTask = async (taskId, updatedData) => {
    if (!auth.currentUser) return;
    try {
      await updateTask(auth.currentUser.uid, taskId, updatedData);
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === taskId ? { ...t, ...updatedData } : t))
      );
      setEditingTask(null);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "error";
      case "Normal":
        return "primary";
      case "Low":
        return "success";
      default:
        return "default";
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "active" && task.status !== "done") ||
      (filter === "completed" && task.status === "done");

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="tasks-page">
      <button className="back-button" onClick={() => navigate("/dashboard")}>
        ⬅️ Back to Dashboard
      </button>
      <h2>📋 Tasks</h2>

      <Box className="tasks-container">
        <TaskCreator onTaskCreate={handleTaskCreate} />

        <Paper className="tasks-list-container">
          <Box className="tasks-header">
            <TextField
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Box className="filter-buttons">
              <Chip
                label="All"
                onClick={() => setFilter("all")}
                color={filter === "all" ? "primary" : "default"}
              />
              <Chip
                label="Active"
                onClick={() => setFilter("active")}
                color={filter === "active" ? "primary" : "default"}
              />
              <Chip
                label="Completed"
                onClick={() => setFilter("completed")}
                color={filter === "completed" ? "primary" : "default"}
              />
            </Box>
          </Box>

          <Divider />

          <List>
            {filteredTasks.map((task) => (
              <ListItem
                key={task.id}
                className={`task-item ${
                  task.status === "done" ? "completed" : ""
                }`}
              >
                <Checkbox
                  edge="start"
                  checked={task.status === "done"}
                  onChange={() => handleToggleComplete(task.id)}
                  icon={<UncheckedIcon />}
                  checkedIcon={<CheckCircleIcon />}
                />
                <ListItemText
                  primary={
                    editingTask?.id === task.id ? (
                      <TextField
                        fullWidth
                        value={editingTask.title}
                        onChange={(e) =>
                          setEditingTask({
                            ...editingTask,
                            title: e.target.value,
                          })
                        }
                        onBlur={() => handleEditTask(task.id, editingTask)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            handleEditTask(task.id, editingTask);
                          }
                        }}
                      />
                    ) : (
                      task.title
                    )
                  }
                  secondary={
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.5,
                      }}
                    >
                      <Typography
                        component="span"
                        variant="body2"
                        color="textPrimary"
                      >
                        {task.description}
                      </Typography>
                      {task.dueDate && (
                        <Typography
                          component="span"
                          variant="caption"
                          color="textSecondary"
                        >
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </Typography>
                      )}
                      <Box sx={{ mt: 0.5 }}>
                        <Chip
                          size="small"
                          label={task.priority}
                          color={getPriorityColor(task.priority)}
                          className="priority-chip"
                        />
                      </Box>
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={() =>
                      setEditingTask(editingTask?.id === task.id ? null : task)
                    }
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
    </div>
  );
};

export default TasksPage;
