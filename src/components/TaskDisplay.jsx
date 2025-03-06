import { useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import "../styles/TaskDisplay.css";

const TaskDisplay = ({ tasks = [], onTaskDelete }) => {
  const [pageSize, setPageSize] = useState(5);
  const [selectedRows, setSelectedRows] = useState([]);

  if (tasks.length === 0) {
    return <p>No tasks yet.</p>;
  }

  // Define columns
  const columns = [
    { field: "title", headerName: "Title", flex: 1 },
    { field: "description", headerName: "Description", flex: 2 },
    {
      field: "dueDate",
      headerName: "Due Date & Time",
      flex: 1,
      sortable: true,
      renderCell: (params) => {
        const dueDate = params.value ? new Date(params.value) : null;
        return dueDate ? dueDate.toLocaleString() : "N/A";
      },
    },
    { field: "priority", headerName: "Priority", flex: 1, sortable: true },
  ];

  // Convert tasks into row format for DataGrid
  const rows = tasks.map((task) => ({
    id: task.id,
    title: task.title,
    description: task.description,
    dueDate: task.dueDate || "N/A",
    priority: task.priority,
  }));

  // 🔥 Ensure "Delete Selected" button correctly deletes multiple tasks
  const handleDeleteSelected = () => {
    if (selectedRows.length === 0) return;
    onTaskDelete(selectedRows); // Pass selected task IDs to App.jsx
    setSelectedRows([]); // Clear selection after deletion
  };

  return (
    <div className="task-container">
      {/* Buttons Above DataGrid */}
      <div className="task-actions">
        <button
          onClick={handleDeleteSelected}
          disabled={selectedRows.length === 0}
          className="delete-button"
        >
          Delete Selected
        </button>
      </div>

      {/* DataGrid */}
      <div className="task-display">
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          pagination
          autoHeight
          disableSelectionOnClick
          checkboxSelection // Enables row selection
          onRowSelectionModelChange={(selection) => setSelectedRows(selection)} // Updates selected tasks
          components={{ Toolbar: GridToolbar }} // Includes toolbar
        />
      </div>
    </div>
  );
};

export default TaskDisplay;
