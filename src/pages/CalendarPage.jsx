import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import { getTasks } from "../services/taskService";
import { auth } from "../firebaseConfig";
import {
  Box,
  Paper,
  Typography,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Today as TodayIcon,
} from "@mui/icons-material";
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
  const [currentView, setCurrentView] = useState(Views.MONTH);
  const [currentDate, setCurrentDate] = useState(new Date());

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
      priority: task.priority || "Normal",
      status: task.status || "todo",
      description: task.description,
    }));
    setTasks(formattedTasks);
  };

  // ✅ Allow `react-big-calendar` to manage navigation
  const handleNavigate = (newDate) => {
    setCurrentDate(newDate);
  };

  // Custom event styling based on priority and status
  const eventStyleGetter = (event) => {
    let backgroundColor = "#3174ad"; // Default color
    let borderColor = "#3174ad";

    // Set color based on priority
    switch (event.priority) {
      case "High":
        backgroundColor = event.status === "done" ? "#4caf50" : "#f44336";
        borderColor = event.status === "done" ? "#4caf50" : "#f44336";
        break;
      case "Normal":
        backgroundColor = event.status === "done" ? "#4caf50" : "#2196f3";
        borderColor = event.status === "done" ? "#4caf50" : "#2196f3";
        break;
      case "Low":
        backgroundColor = event.status === "done" ? "#4caf50" : "#ff9800";
        borderColor = event.status === "done" ? "#4caf50" : "#ff9800";
        break;
      default:
        backgroundColor = event.status === "done" ? "#4caf50" : "#3174ad";
        borderColor = event.status === "done" ? "#4caf50" : "#3174ad";
    }

    return {
      style: {
        backgroundColor,
        borderColor,
        borderRadius: "4px",
        opacity: 0.8,
        color: "white",
        border: "0",
        display: "block",
        padding: "2px 5px",
        fontSize: "0.85em",
        fontWeight: "500",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      },
    };
  };

  // Custom toolbar with better navigation
  const CustomToolbar = (toolbar) => {
    const goToBack = () => {
      toolbar.onNavigate("PREV");
    };
    const goToNext = () => {
      toolbar.onNavigate("NEXT");
    };
    const goToCurrent = () => {
      toolbar.onNavigate("TODAY");
    };

    return (
      <Box className="calendar-toolbar">
        <Box className="toolbar-left">
          <Typography variant="h6" className="toolbar-title">
            {toolbar.label}
          </Typography>
          <Box className="navigation-buttons">
            <Tooltip title="Previous">
              <IconButton onClick={goToBack}>
                <ArrowBackIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Today">
              <IconButton onClick={goToCurrent}>
                <TodayIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Next">
              <IconButton onClick={goToNext}>
                <ArrowForwardIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <Box className="toolbar-right">
          <Chip
            label="Month"
            onClick={() => toolbar.onView(Views.MONTH)}
            color={toolbar.view === Views.MONTH ? "primary" : "default"}
            sx={{ mr: 1 }}
          />
          <Chip
            label="Week"
            onClick={() => toolbar.onView(Views.WEEK)}
            color={toolbar.view === Views.WEEK ? "primary" : "default"}
            sx={{ mr: 1 }}
          />
          <Chip
            label="Day"
            onClick={() => toolbar.onView(Views.DAY)}
            color={toolbar.view === Views.DAY ? "primary" : "default"}
          />
        </Box>
      </Box>
    );
  };

  return (
    <div className="calendar-page">
      <button className="back-button" onClick={() => navigate("/dashboard")}>
        ⬅️ Back to Dashboard
      </button>
      <h2>📅 Task Calendar</h2>

      <Paper className="calendar-container">
        <Calendar
          localizer={localizer}
          events={tasks}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "80vh", width: "100%" }}
          view={currentView}
          onView={setCurrentView}
          date={currentDate}
          onNavigate={handleNavigate}
          components={{ toolbar: CustomToolbar }}
          eventPropGetter={eventStyleGetter}
          tooltipAccessor={(event) =>
            `${event.title}\n${event.description || ""}`
          }
          popup
          selectable
          resizable
          longPressThreshold={1}
        />
      </Paper>
    </div>
  );
};

export default CalendarPage;
