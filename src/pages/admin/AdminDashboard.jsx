import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminYear } from "./AdminYearContext";
import { supabase } from "../../supabaseClient";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const { years, activeYear, changeYear, fetchYears, loadingYears } = useAdminYear();

  const [newYearInput, setNewYearInput] = useState("");
  const [newTitleInput, setNewTitleInput] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleCreateNewYear(e) {
    e.preventDefault();
    if (!newYearInput) return;

    const { error } = await supabase.from("festival_years").insert([
      {
        year: Number(newYearInput),
        title: newTitleInput.trim() || `Vinayaka Chavithi ${newYearInput}`,
      },
    ]);

    if (!error) {
      setMsg(`✅ Festival year ${newYearInput} created!`);
      await fetchYears();
      changeYear(Number(newYearInput));
      setShowAddModal(false);
      setNewYearInput("");
      setNewTitleInput("");
    } else {
      setMsg("❌ Error creating year: " + error.message);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/admin/login");
  }

  return (
    <div className="admin-dashboard-container">
      {/* Top Header */}
      <header className="admin-dash-header">
        <div>
          <span className="admin-badge">DSB ADMIN PANEL</span>
          <h1>Festival Control Hub</h1>
        </div>
        <button onClick={handleLogout} className="admin-logout-btn">
          🚪 Logout
        </button>
      </header>

      {msg && <div className="admin-msg-banner">{msg}</div>}

      {/* 1. YEAR SELECTOR GATE */}
      <div className="year-selector-gate-card">
        <div className="gate-title-row">
          <div>
            <span className="gate-label">ACTIVE FESTIVAL YEAR BEING MANAGED</span>
            <h2>Select Year to Update Data</h2>
          </div>
          <button onClick={() => setShowAddModal(true)} className="add-year-pill-btn">
            ➕ Add New Year
          </button>
        </div>

        {loadingYears ? (
          <p>Loading festival years...</p>
        ) : (
          <div className="years-pill-grid">
            {years.map((y) => (
              <button
                key={y.id}
                type="button"
                className={`year-card-btn ${activeYear === y.year ? "selected" : ""}`}
                onClick={() => changeYear(y.year)}
              >
                <span className="year-num">{y.year}</span>
                <span className="year-sub">{y.title}</span>
                {activeYear === y.year && <span className="active-indicator">✓ CURRENT ACTIVE</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2. MODULE NAVIGATION FOR ACTIVE YEAR */}
      <div className="module-section">
        <div className="module-section-header">
          <h3>
            Managing Content for: <span className="highlight-year">{activeYear} Mahotsav</span>
          </h3>
          <p>All updates made below will apply directly to the {activeYear} festival edition.</p>
        </div>

        <div className="admin-modules-grid">
          <div className="module-card" onClick={() => navigate("/admin/schedule")}>
            <div className="module-icon">📅</div>
            <h4>Festival Schedule</h4>
            <p>Update Vedic muhurtham timings, rituals, and descriptions for {activeYear}.</p>
            <span className="module-go-btn">Manage Schedule →</span>
          </div>

          <div className="module-card" onClick={() => navigate("/admin/events")}>
            <div className="module-icon">🎉</div>
            <h4>Cultural Events</h4>
            <p>Manage music, laddu auctions, and special performances for {activeYear}.</p>
            <span className="module-go-btn">Manage Events →</span>
          </div>

          <div className="module-card" onClick={() => navigate("/admin/donations")}>
            <div className="module-icon">💰</div>
            <h4>Chanda, Spendings &amp; Accounts</h4>
            <p>Approve donations, record itemized spendings, and balance {activeYear} accounts.</p>
            <span className="module-go-btn">Manage Accounts →</span>
          </div>

          <div className="module-card" onClick={() => navigate("/admin/idol")}>
            <div className="module-icon">🪔</div>
            <h4>Ganesh Idol &amp; Sponsor</h4>
            <p>Set {activeYear} Vigraham title, height, donor sponsor name, and photo.</p>
            <span className="module-go-btn">Manage Idol →</span>
          </div>

          <div className="module-card" onClick={() => navigate("/admin/gallery")}>
            <div className="module-icon">🖼️</div>
            <h4>Photo Gallery</h4>
            <p>Upload celebrations, aarti, and visarjan photos for {activeYear}.</p>
            <span className="module-go-btn">Manage Gallery →</span>
          </div>
        </div>
      </div>

      {/* ADD NEW YEAR MODAL */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowAddModal(false)}>×</button>
            <h3>➕ Add New Festival Year</h3>
            <form onSubmit={handleCreateNewYear}>
              <div className="admin-form-group">
                <label>Year (e.g. 2027) *</label>
                <input
                  type="number"
                  placeholder="2027"
                  value={newYearInput}
                  onChange={(e) => setNewYearInput(e.target.value)}
                  required
                />
              </div>
              <div className="admin-form-group">
                <label>Festival Theme / Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Sri Vinayaka Mahotsav 2027"
                  value={newTitleInput}
                  onChange={(e) => setNewTitleInput(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="admin-save-btn">Create Year &amp; Select</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;