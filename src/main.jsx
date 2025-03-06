import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // ✅ Ensure Router is here
import App from "./App";
import "./styles/index.css";
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      {" "}
      {/* ✅ Now, this is the ONLY Router */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
