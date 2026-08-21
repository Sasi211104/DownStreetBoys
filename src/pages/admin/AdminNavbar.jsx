import React from "react";
import { useNavigate } from "react-router-dom";
import { useAdminYear } from "./AdminYearContext";
import "./AdminNavbar.css";

function AdminNavbar({ title }) {
  const navigate = useNavigate();
  const { activeYear } = useAdminYear();

  return (
    <div className="admin-top-nav-bar">
      <div className="nav-left">
        <button onClick={() => navigate("/admin/dashboard")} className="admin-back-btn">
          ← Dashboard
        </button>
        <h2>{title}</h2>
      </div>

      <div className="nav-year-display">
        <span className="managing-year-pill">
          YEAR: <strong>{activeYear}</strong>
        </span>
        <button 
          type="button" 
          onClick={() => navigate("/admin/dashboard")} 
          className="switch-year-btn"
        >
          🔄 Change Year
        </button>
      </div>
    </div>
  );
}

export default AdminNavbar;