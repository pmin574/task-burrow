import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import { getTasks } from "../services/taskService";
import { auth } from "../firebaseConfig";
import "../styles/CalendarPage.css";

// 📅 Configure localization for react-big-calendar
const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

const CalendarPage = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (auth.currentUser) {
      fetchTasks();
    }
  }, [auth.currentUser]);

  // 🔥 Fetch tasks from Firebase and convert to calendar events
  const fetchTasks = async () => {
    if (!auth.currentUser) return;
    const fetchedTasks = await getTasks(auth.currentUser.uid);
    const formattedTasks = fetchedTasks.map((task) => ({
      id: task.id,
      title: task.title,
      start: task.dueDate ? new Date(task.dueDate) : new Date(),
      end: task.dueDate ? new Date(task.dueDate) : new Date(),
    }));
    setTasks(formattedTasks);
  };

  return (
    <div className="calendar-page">
      <button className="back-button" onClick={() => navigate("/")}>
        ⬅️ Back to Dashboard
      </button>
      <h2>📅 Task Calendar</h2>
      <div className="calendar-container">
        <Calendar
          localizer={localizer}
          events={tasks}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "80vh", width: "100%", marginTop: "20px" }}
        />
      </div>
    </div>
  );
};

export default CalendarPage;
