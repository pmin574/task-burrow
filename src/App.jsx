import { useState } from "react";
import TaskCreator from "./components/TaskCreator";
import "./styles/App.css";

function App() {
  const [tasks, setTasks] = useState([]);

  const addTask = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Task Manager</h1>
      <TaskCreator onTaskCreate={addTask} />
    </div>
  );
}

export default App;
