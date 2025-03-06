import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { auth, onAuthStateChanged } from "./firebaseConfig";
import CalendarPage from "./pages/CalendarPage";
import InsightsPage from "./pages/InsightsPage";
import KanbanBoardPage from "./pages/KanbanBoardPage";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard"; // ✅ New import
import TasksPage from "./pages/TasksPage";

function App() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser || null);
    });

    return () => unsubscribe();
  }, []);

  if (user === undefined) {
    return <p>Loading...</p>;
  }

  return (
    <Routes>
      {/* Redirect logged-in users to Dashboard */}
      <Route
        path="/"
        element={user ? <Navigate to="/dashboard" /> : <LandingPage />}
      />
      <Route
        path="/dashboard"
        element={user ? <Dashboard /> : <Navigate to="/" />}
      />
      <Route path="/calendar" element={<CalendarPage />} />
      <Route path="/insights" element={<InsightsPage />} />
      <Route path="/kanban" element={<KanbanBoardPage />} />
      <Route path="/tasks" element={<TasksPage />} />
    </Routes>
  );
}

export default App;
