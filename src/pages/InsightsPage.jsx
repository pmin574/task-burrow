import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Grid, Paper, Typography } from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";
import { format, subDays, startOfWeek, eachDayOfInterval } from "date-fns";
import { getTasks } from "../services/taskService";
import { auth } from "../firebaseConfig";
import "../styles/InsightsPage.css";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const InsightsPage = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (auth.currentUser) {
      fetchTasks();
    }
  }, [auth.currentUser]);

  const fetchTasks = async () => {
    if (!auth.currentUser) return;
    const fetchedTasks = await getTasks(auth.currentUser.uid);
    setTasks(fetchedTasks);
    setLoading(false);
  };

  // Task completion rate over time
  const getCompletionRateData = () => {
    const last7Days = eachDayOfInterval({
      start: subDays(new Date(), 6),
      end: new Date(),
    });

    const completionData = last7Days.map((date) => {
      const dayTasks = tasks.filter((task) => {
        const taskDate = task.dueDate
          ? new Date(task.dueDate)
          : new Date(task.createdAt);
        return format(taskDate, "yyyy-MM-dd") === format(date, "yyyy-MM-dd");
      });
      const completedTasks = dayTasks.filter((task) => task.status === "done");
      return {
        date: format(date, "MMM dd"),
        rate:
          dayTasks.length > 0
            ? (completedTasks.length / dayTasks.length) * 100
            : 0,
      };
    });

    return {
      labels: completionData.map((d) => d.date),
      datasets: [
        {
          label: "Completion Rate (%)",
          data: completionData.map((d) => d.rate),
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    };
  };

  // Task distribution by priority
  const getPriorityDistributionData = () => {
    const priorityCounts = tasks.reduce((acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    }, {});

    return {
      labels: Object.keys(priorityCounts),
      datasets: [
        {
          data: Object.values(priorityCounts),
          backgroundColor: [
            "rgba(255, 99, 132, 0.8)",
            "rgba(54, 162, 235, 0.8)",
            "rgba(255, 206, 86, 0.8)",
          ],
        },
      ],
    };
  };

  // Task distribution by status
  const getStatusDistributionData = () => {
    const statusCounts = tasks.reduce((acc, task) => {
      acc[task.status || "todo"] = (acc[task.status || "todo"] || 0) + 1;
      return acc;
    }, {});

    return {
      labels: ["To Do", "In Progress", "Done"],
      datasets: [
        {
          data: [
            statusCounts.todo || 0,
            statusCounts.inProgress || 0,
            statusCounts.done || 0,
          ],
          backgroundColor: [
            "rgba(255, 99, 132, 0.8)",
            "rgba(255, 206, 86, 0.8)",
            "rgba(75, 192, 192, 0.8)",
          ],
        },
      ],
    };
  };

  // Task completion time analysis
  const getCompletionTimeData = () => {
    const completedTasks = tasks.filter((task) => task.status === "done");
    const timeRanges = {
      "Same Day": 0,
      "1-2 Days": 0,
      "3-5 Days": 0,
      "6+ Days": 0,
    };

    completedTasks.forEach((task) => {
      const createdDate = new Date(task.createdAt);
      const completedDate = new Date(task.updatedAt);
      const daysToComplete = Math.ceil(
        (completedDate - createdDate) / (1000 * 60 * 60 * 24)
      );

      if (daysToComplete === 0) timeRanges["Same Day"]++;
      else if (daysToComplete <= 2) timeRanges["1-2 Days"]++;
      else if (daysToComplete <= 5) timeRanges["3-5 Days"]++;
      else timeRanges["6+ Days"]++;
    });

    return {
      labels: Object.keys(timeRanges),
      datasets: [
        {
          data: Object.values(timeRanges),
          backgroundColor: [
            "rgba(75, 192, 192, 0.8)",
            "rgba(54, 162, 235, 0.8)",
            "rgba(255, 206, 86, 0.8)",
            "rgba(255, 99, 132, 0.8)",
          ],
        },
      ],
    };
  };

  // Task creation trend
  const getTaskCreationTrendData = () => {
    const last7Days = eachDayOfInterval({
      start: subDays(new Date(), 6),
      end: new Date(),
    });

    const creationData = last7Days.map((date) => {
      const dayTasks = tasks.filter((task) => {
        const taskDate = new Date(task.createdAt);
        return format(taskDate, "yyyy-MM-dd") === format(date, "yyyy-MM-dd");
      });

      return {
        date: format(date, "MMM dd"),
        count: dayTasks.length,
        completed: dayTasks.filter((task) => task.status === "done").length,
      };
    });

    return {
      labels: creationData.map((d) => d.date),
      datasets: [
        {
          label: "New Tasks",
          data: creationData.map((d) => d.count),
          borderColor: "rgb(54, 162, 235)",
          tension: 0.1,
        },
        {
          label: "Completed",
          data: creationData.map((d) => d.completed),
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    };
  };

  if (loading) {
    return <div className="loading">Loading insights...</div>;
  }

  return (
    <div className="insights-page">
      <button className="back-button" onClick={() => navigate("/dashboard")}>
        ⬅️ Back to Dashboard
      </button>
      <h2>📊 Task Insights</h2>

      <Grid container spacing={3}>
        {/* Task Completion Rate */}
        <Grid item xs={12} md={6}>
          <Paper className="chart-container">
            <Typography variant="h6" gutterBottom>
              Task Completion Rate (Last 7 Days)
            </Typography>
            <Line
              data={getCompletionRateData()}
              options={{
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100,
                  },
                },
              }}
            />
          </Paper>
        </Grid>

        {/* Priority Distribution */}
        <Grid item xs={12} md={6}>
          <Paper className="chart-container">
            <Typography variant="h6" gutterBottom>
              Task Distribution by Priority
            </Typography>
            <Doughnut
              data={getPriorityDistributionData()}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "bottom",
                  },
                },
              }}
            />
          </Paper>
        </Grid>

        {/* Status Distribution */}
        <Grid item xs={12} md={6}>
          <Paper className="chart-container">
            <Typography variant="h6" gutterBottom>
              Task Distribution by Status
            </Typography>
            <Doughnut
              data={getStatusDistributionData()}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "bottom",
                  },
                },
              }}
            />
          </Paper>
        </Grid>

        {/* Task Completion Time Analysis */}
        <Grid item xs={12} md={6}>
          <Paper className="chart-container">
            <Typography variant="h6" gutterBottom>
              Task Completion Time Analysis
            </Typography>
            <Doughnut
              data={getCompletionTimeData()}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "bottom",
                  },
                },
              }}
            />
          </Paper>
        </Grid>

        {/* Task Creation Trend */}
        <Grid item xs={12} md={6}>
          <Paper className="chart-container">
            <Typography variant="h6" gutterBottom>
              Task Creation Trend (Last 7 Days)
            </Typography>
            <Line
              data={getTaskCreationTrendData()}
              options={{
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default InsightsPage;
