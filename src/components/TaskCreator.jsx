import { useState } from "react";
import "../styles/TaskCreator.css";

const TaskCreator = ({ onTaskCreate }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setLoading(true);
    await onTaskCreate({ title, description });
    setLoading(false);

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
        disabled={loading}
      />
      <textarea
        placeholder="Task Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="task-textarea"
        disabled={loading}
      />
      <button type="submit" className="task-button" disabled={loading}>
        {loading ? "Adding..." : "Add Task"}
      </button>
    </form>
  );
};

export default TaskCreator;
