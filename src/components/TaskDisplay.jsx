import "../styles/TaskDisplay.css";

const TaskDisplay = ({ tasks = [] }) => {
  return (
    <ul className="task-display">
      {tasks.length === 0 ? (
        <p>No tasks yet.</p>
      ) : (
        tasks.map((task) => (
          <li key={task.id} className="task-item">
            <strong>{task.title}</strong>
            <p>{task.description}</p>
            <small>
              Created at: {task.createdAt ? task.createdAt.toLocaleString() : "Unknown"}
            </small>
          </li>
        ))
      )}
    </ul>
  );
};

export default TaskDisplay;
