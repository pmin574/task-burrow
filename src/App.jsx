import { useState } from "react";
import TaskCreator from "./components/TaskCreator";
import "./styles/App.css";
import "./styles/Logo.css"
import logo from "./assets/TaskBurrow_Logo_PNG.png"; // Import logo from assets

function App() {
  const [tasks, setTasks] = useState([]);

  const addTask = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  return (
    <div style={{ padding: "20px" }}>
      <img src={logo} alt="task burrow" className="spinning-logo" />
      <h1>Task Manager</h1>
      <TaskCreator onTaskCreate={addTask} />
    </div>
  );
}

export default App;
