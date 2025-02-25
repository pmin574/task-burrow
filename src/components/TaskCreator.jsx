import { useState } from "react";
import "../styles/TaskCreator.css";

const TaskCreator = ({ onTaskCreate }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const newTask = {
      title,
      description,
      createdAt: new Date().toLocaleString(), // Timestamp when the task is created
    };

    console.log("New Task Created:", newTask); // Debugging: Log user input
    onTaskCreate(newTask); // Pass task data to the parent component

    // Reset input fields
    setTitle("");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit} className="task-creator">
      <input
        type="text"
        placeholder="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="task-input"
      />
      <textarea
        placeholder="Task Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="task-textarea"
      />
      <button type="submit" className="task-button">Add Task</button>
    </form>
  );
};

export default TaskCreator;
