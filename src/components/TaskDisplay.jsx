import "../styles/TaskDisplay.css";

const TaskDisplay = ({ tasks = [], onTaskToggle, onTaskDelete }) => {
  return (
    <ul className="task-display">
      {tasks.length === 0 ? (
        <p>No tasks yet.</p>
      ) : (
        tasks.map((task) => (
          <li
            key={task.id}
            className={`task-item ${task.completed ? "completed" : ""}`}
          >
            <strong>{task.title}</strong>
            <p>{task.description}</p>
            {task.dueDate && (
              <p>
                <strong>Due:</strong> {task.dueDate}
              </p>
            )}
            <p>
              <strong>Priority:</strong> {task.priority}
            </p>
            <label>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onTaskToggle(task.id, !task.completed)}
              />
              Completed
            </label>
            <small>
              Created at:{" "}
              {task.createdAt ? task.createdAt.toLocaleString() : "Unknown"}
            </small>
            {/* Delete button for individual task */}
            <button onClick={() => onTaskDelete(task.id)}>Delete</button>
          </li>
        ))
      )}
    </ul>
  );
};

export default TaskDisplay;
