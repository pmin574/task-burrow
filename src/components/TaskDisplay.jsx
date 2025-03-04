import { useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import "../styles/TaskDisplay.css";

const TaskDisplay = ({ tasks = [], onTaskDelete, onTaskEdit }) => {
  const [pageSize, setPageSize] = useState(5);
  const [selectedRows, setSelectedRows] = useState([]);

  if (tasks.length === 0) {
    return <p>No tasks yet.</p>;
  }

  // Define columns
  const columns = [
    { field: "title", headerName: "Title", flex: 1, editable: true },
    {
      field: "description",
      headerName: "Description",
      flex: 2,
      editable: true,
    },
    {
      field: "dueDate",
      headerName: "Due Date",
      flex: 1,
      editable: true,
      sortable: true,
    },
    {
      field: "priority",
      headerName: "Priority",
      flex: 1,
      editable: true,
      sortable: true,
    },
  ];

  // Convert tasks into row format for DataGrid
  const rows = tasks.map((task) => ({
    id: task.id, // Use actual task ID instead of index
    title: task.title,
    description: task.description,
    dueDate: task.dueDate || "N/A",
    priority: task.priority,
  }));

  // Function to delete selected tasks
  const handleDeleteSelected = () => {
    if (selectedRows.length === 0) return;

    onTaskDelete(selectedRows);
    setSelectedRows([]);
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
          onCellEditStop={(params, event) => {
            if (event && event.key === "Enter") {
              onTaskEdit(params.id, params.field, event.target.value);
            }
          }}
          components={{ Toolbar: GridToolbar }} // Includes toolbar
        />
      </div>
    </div>
  );
};

export default TaskDisplay;
