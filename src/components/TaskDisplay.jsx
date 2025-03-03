import "../styles/TaskDisplay.css";

const TaskDisplay = ({ tasks = [], onTaskToggle, onTaskDelete }) => {
  if (tasks.length === 0) {
    return <p>No tasks yet.</p>;
  }

  return (
    <div className="task-display">
      <table className="task-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Due Date</th>
            <th>Priority</th>
            <th>Completed</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id} className={task.completed ? "completed" : ""}>
              <td>{task.title}</td>
              <td>{task.description}</td>
              <td>{task.dueDate || "N/A"}</td>
              <td>{task.priority}</td>
              <td>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => onTaskToggle(task.id, !task.completed)}
                />
              </td>
              <td>
                {task.createdAt ? task.createdAt.toLocaleString() : "Unknown"}
              </td>
              <td>
                <button onClick={() => onTaskDelete(task.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskDisplay;
