import React from "react";
import { useNavigate } from "react-router-dom";
import KanbanBoard from "../components/KanbanBoard";
import "../styles/KanbanBoardPage.css";

const KanbanBoardPage = () => {
  const navigate = useNavigate();

  return (
    <div className="kanban-page">
      <button className="back-button" onClick={() => navigate("/dashboard")}>
        ⬅️ Back to Dashboard
      </button>
      <h2>🗂️ Kanban Board</h2>
      <KanbanBoard />
    </div>
  );
};

export default KanbanBoardPage;
