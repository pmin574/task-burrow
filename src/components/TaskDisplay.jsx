import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useState } from "react";
import "../styles/TaskDisplay.css";

const TaskDisplay = ({ tasks = [] }) => {
  const [pageSize, setPageSize] = useState(5); // Default pagination size

  if (tasks.length === 0) {
    return <p>No tasks yet.</p>;
  }

  // Define columns
  const columns = [
    { field: "title", headerName: "Title", flex: 1 },
    { field: "description", headerName: "Description", flex: 2 },
    { field: "dueDate", headerName: "Due Date", flex: 1, sortable: true },
    { field: "priority", headerName: "Priority", flex: 1, sortable: true },
  ];

  // Convert tasks into row format for DataGrid
  const rows = tasks.map((task, index) => ({
    id: index, // Required for DataGrid
    title: task.title,
    description: task.description,
    dueDate: task.dueDate || "N/A",
    priority: task.priority,
  }));

  return (
    <div className="task-display">
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        pagination
        autoHeight
        disableSelectionOnClick
        components={{ Toolbar: GridToolbar }} // Add the toolbar
      />
    </div>
  );
};

export default TaskDisplay;
