import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Paper, Typography, Box } from "@mui/material";
import { getTasks, updateTask } from "../services/taskService";
import { auth } from "../firebaseConfig";
import "../styles/KanbanBoard.css";

const KanbanBoard = () => {
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    done: [],
  });

  useEffect(() => {
    if (auth.currentUser) {
      fetchTasks();
    }
  }, [auth.currentUser]);

  const fetchTasks = async () => {
    if (!auth.currentUser) return;
    const fetchedTasks = await getTasks(auth.currentUser.uid);

    // Organize tasks by status
    const organizedTasks = {
      todo: fetchedTasks.filter(
        (task) => !task.status || task.status === "todo"
      ),
      inProgress: fetchedTasks.filter((task) => task.status === "inProgress"),
      done: fetchedTasks.filter((task) => task.status === "done"),
    };

    setTasks(organizedTasks);
  };

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    // Drop outside a valid droppable area
    if (!destination) return;

    // Drop in the same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Find the task being dragged
    const sourceColumn = tasks[source.droppableId];
    const destColumn = tasks[destination.droppableId];
    const [movedTask] = sourceColumn.splice(source.index, 1);

    // Update the task's status
    const newStatus = destination.droppableId;
    movedTask.status = newStatus;

    // Update in Firebase
    if (auth.currentUser) {
      await updateTask(auth.currentUser.uid, movedTask.id, {
        status: newStatus,
      });
    }

    // Update local state
    const newTasks = {
      ...tasks,
      [source.droppableId]: sourceColumn,
      [destination.droppableId]: [
        ...destColumn.slice(0, destination.index),
        movedTask,
        ...destColumn.slice(destination.index),
      ],
    };
    setTasks(newTasks);
  };

  const TaskCard = ({ task, index }) => (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <Paper
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="task-card"
        >
          <Typography variant="h6">{task.title}</Typography>
          <Typography variant="body2" color="textSecondary">
            {task.description}
          </Typography>
          {task.dueDate && (
            <Typography variant="caption" color="textSecondary">
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </Typography>
          )}
        </Paper>
      )}
    </Draggable>
  );

  const Column = ({ title, tasks, droppableId }) => (
    <Box className="kanban-column">
      <Typography variant="h6" className="column-title">
        {title} ({tasks.length})
      </Typography>
      <Droppable droppableId={droppableId}>
        {(provided) => (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="task-list"
          >
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </Box>
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Box className="kanban-board">
        <Column title="To Do" tasks={tasks.todo} droppableId="todo" />
        <Column
          title="In Progress"
          tasks={tasks.inProgress}
          droppableId="inProgress"
        />
        <Column title="Done" tasks={tasks.done} droppableId="done" />
      </Box>
    </DragDropContext>
  );
};

export default KanbanBoard;
