import { useState, useEffect } from "react";
import { auth, loginWithGoogle, logout } from "./firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import TaskCreator from "./components/TaskCreator";
import TaskDisplay from "./components/TaskDisplay";
import { addTask, getTasks } from "./services/taskService"; // Import Firestore functions
import "./styles/App.css";
import "./styles/Logo.css";
import logo from "./assets/TaskBurrow_Logo_PNG.png";

function App() {
  const [user, setUser] = useState(undefined);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser || null);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchTasks(); // Fetch tasks when user logs in
    }
  }, [user]);

  const fetchTasks = async () => {
    const fetchedTasks = await getTasks();
    setTasks(fetchedTasks);
  };

  const handleTaskCreate = async (newTask) => {
    const taskWithId = await addTask(newTask);
    if (taskWithId) {
      setTasks((prevTasks) => [...prevTasks, taskWithId]);
    }
  };

  if (user === undefined) {
    return <p>Loading...</p>;
  }

  return (
    <div className="app-container">
      <img src={logo} alt="Task Burrow" className="spinning-logo" />
      <h1>Task Manager</h1>

      {user ? (
        <>
          <p>Welcome, {user.displayName}</p>
          <button onClick={logout}>Logout</button>
          <TaskCreator onTaskCreate={handleTaskCreate} />
          <TaskDisplay tasks={tasks} />
        </>
      ) : (
        <button onClick={loginWithGoogle}>Login with Google</button>
      )}
    </div>
  );
}

export default App;
