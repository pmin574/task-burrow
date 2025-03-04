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
  const [priority, setPriority] = useState("Normal");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setLoading(true);
    await onTaskCreate({ title, description, dueDate, priority });
    setLoading(false);

    setTitle("");
    setDescription("");
    setDueDate("");
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
            <Grid item xs={12} sm={6}>
              <TextField
                label="Task Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                margin="dense"
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
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
