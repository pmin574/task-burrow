import React, { useEffect, useState } from "react";
import TaskCreator from "../components/TaskCreator";
import { addTask } from "../services/taskService";
import { auth, onAuthStateChanged } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";

const CreateTaskPage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        navigate("/"); // Redirect to login if not authenticated
      } else {
        setUser(firebaseUser);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // 🔥 Ensure new tasks sync in real-time
  const handleTaskCreate = async (newTask) => {
    if (!user) return;
    console.log("Creating task:", newTask); // Debugging
    await addTask(user.uid, newTask);
  };

  return (
    <div>
      <h2>➕ Create a New Task</h2>
      {!user ? (
        <p>Loading...</p>
      ) : (
        <TaskCreator onTaskCreate={handleTaskCreate} />
      )}
    </div>
  );
};

export default CreateTaskPage;
