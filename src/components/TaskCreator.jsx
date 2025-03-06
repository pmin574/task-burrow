import { useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Stack,
  Grid,
  Paper,
  Typography,
} from "@mui/material";

const TaskCreator = ({ onTaskCreate }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState(""); // Optional Time Input
  const [priority, setPriority] = useState("Normal");
  const [loading, setLoading] = useState(false);

  // ✅ Track missing fields
  const [errors, setErrors] = useState({ title: false, description: false });

  // ✅ Handles Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for missing fields
    let newErrors = {
      title: title.trim() === "",
      description: description.trim() === "",
    };

    setErrors(newErrors);

    // If any field is missing, do not proceed
    if (newErrors.title || newErrors.description) {
      // 🔥 Remove highlight after 3 seconds
      setTimeout(() => {
        setErrors({ title: false, description: false });
      }, 3000);
      return;
    }

    let dueDateTime = dueDate;
    if (dueDate && dueTime) {
      dueDateTime = `${dueDate}T${dueTime}:00`;
    }

    setLoading(true);
    await onTaskCreate({ title, description, dueDate: dueDateTime, priority });
    setLoading(false);

    // Reset Fields
    setTitle("");
    setDescription("");
    setDueDate("");
    setDueTime("");
    setPriority("Normal");
  };

  return (
    <Paper
      elevation={3}
      sx={{
        padding: 2,
        border: "1px solid #ccc",
        borderRadius: 1,
        maxWidth: 400,
        margin: "auto",
      }}
    >
      <Typography variant="h6" align="center" gutterBottom>
        Create a Task
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={1}>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <TextField
                label="Task Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                margin="dense"
                size="small"
                error={errors.title} // ✅ Highlight if missing
                sx={{ backgroundColor: errors.title ? "#ffebee" : "white" }} // Red flash for 3s
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Due Date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
                margin="dense"
                size="small"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Due Time (Optional)"
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
                margin="dense"
                size="small"
              />
            </Grid>
          </Grid>
          <TextField
            label="Task Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={2}
            margin="dense"
            size="small"
            error={errors.description} // ✅ Highlight if missing
            sx={{ backgroundColor: errors.description ? "#ffebee" : "white" }} // Red flash for 3s
          />
          <FormControl fullWidth margin="dense" size="small">
            <InputLabel>Priority</InputLabel>
            <Select
              value={priority}
              label="Priority"
              onChange={(e) => setPriority(e.target.value)}
            >
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Normal">Normal</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </Select>
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            size="small"
          >
            {loading ? "Adding..." : "Add Task"}
          </Button>
        </Stack>
      </form>
    </Paper>
  );
};

export default TaskCreator;
