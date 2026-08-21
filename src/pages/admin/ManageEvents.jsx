import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { useAdminYear } from "./AdminYearContext";
import AdminNavbar from "./AdminNavbar";
import "./ManageEvents.css";

const PRESET_EMOJIS = ["🎉", "🎤", "🥁", "🎭", "🪔", "🍲", "🎨", "💃", "🏆", "🎁", "🔥", "🎊"];

function ManageEvents() {
  const { activeYear, activeYearId } = useAdminYear();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("🎉");

  useEffect(() => {
    fetchEvents();
  }, [activeYear, activeYearId]);

  async function fetchEvents() {
    setLoading(true);

    let query = supabase.from("events").select("*");

    if (activeYearId) {
      query = query.or(`year.eq.${Number(activeYear)},festival_year_id.eq.${activeYearId}`);
    } else {
      query = query.eq("year", Number(activeYear));
    }

    const { data, error } = await query.order("created_at", { ascending: true });

    if (!error) {
      setEvents(data || []);
    }
    setLoading(false);
  }

  function handleEdit(event) {
    setEditingId(event.id);
    setTitle(event.title || "");
    setDate(event.date || event.event_date || "");
    setTime(event.time || event.event_time || "");
    setLocation(event.location || "");
    setDescription(event.description || "");
    setIcon(event.icon || "🎉");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setDate("");
    setTime("");
    setLocation("");
    setDescription("");
    setIcon("🎉");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");

    const basePayload = {
      title: title.trim(),
      description: description.trim(),
      icon: icon || "🎉",
      year: Number(activeYear),
    };

    if (activeYearId) {
      basePayload.festival_year_id = activeYearId;
    }

    // Attempt 1: Full standard payload
    let payload = {
      ...basePayload,
      event_date: date,
      event_time: time.trim(),
      location: location.trim(),
    };

    let res;
    if (editingId) {
      res = await supabase.from("events").update(payload).eq("id", Number(editingId));
    } else {
      res = await supabase.from("events").insert([payload]);
    }

    // Attempt 2: Fallback if 'location' or date naming variants differ
    if (res.error) {
      payload = {
        ...basePayload,
        date: date,
        time: time.trim(),
      };
      if (location.trim()) {
        payload.location = location.trim();
      }

      if (editingId) {
        res = await supabase.from("events").update(payload).eq("id", Number(editingId));
      } else {
        res = await supabase.from("events").insert([payload]);
      }
    }

    if (!res.error) {
      setMsg(editingId ? `✅ Event updated for ${activeYear}!` : `✅ Event added for ${activeYear}!`);
      resetForm();
      fetchEvents();
    } else {
      setMsg(`❌ Error: ${res.error.message}`);
    }
  }
  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    const { error } = await supabase.from("events").delete().eq("id", Number(id));
    if (!error) {
      setMsg("🗑️ Event removed.");
      fetchEvents();
    } else {
      setMsg(`❌ Error deleting: ${error.message}`);
    }
  }

  return (
    <div className="admin-events-page">
      <AdminNavbar title="Cultural Events Management" />

      {msg && <div className="admin-msg-banner">{msg}</div>}

      <div className="admin-events-grid">
        <div className="admin-event-form">
          <h3>{editingId ? "✏️ Edit Event" : `➕ Add New Event for ${activeYear}`}</h3>
          <form onSubmit={handleSubmit}>
            <div className="admin-form-group">
              <label>Event Icon / Emoji</label>
              <div className="emoji-picker-container">
                <div className="emoji-palette">
                  {PRESET_EMOJIS.map((e) => (
                    <button
                      key={e}
                      type="button"
                      className={`emoji-btn ${icon === e ? "active-emoji" : ""}`}
                      onClick={() => setIcon(e)}
                    >
                      {e}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  className="emoji-input-field"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  maxLength={4}
                  placeholder="Custom emoji"
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label>Event Title *</label>
              <input
                type="text"
                placeholder="e.g. Dance Program"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label>Date *</label>
                <input
                  type="date"
                  className="date-picker-input"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div className="admin-form-group">
                <label>Time *</label>
                <input
                  type="text"
                  placeholder="e.g. 18:02"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label>Location / Stage</label>
              <input
                type="text"
                placeholder="e.g. DSB Pandal Main Stage"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="admin-form-group">
              <label>Description</label>
              <textarea
                rows={3}
                placeholder="dance program starts..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="admin-form-buttons">
              <button type="submit" className="admin-save-btn">
                {editingId ? "Update Event" : "Save Event"}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} className="admin-cancel-btn">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="admin-events-list">
          <h3>📅 {activeYear} Scheduled Events ({events.length})</h3>
          {loading ? (
            <p>Loading events for {activeYear}...</p>
          ) : events.length === 0 ? (
            <p>No events found for {activeYear}.</p>
          ) : (
            events.map((ev) => (
              <div className="admin-item-card" key={ev.id}>
                <div className="admin-item-info">
                  <span className="admin-item-icon">{ev.icon || "🎉"}</span>
                  <div>
                    <strong>{ev.title}</strong>
                    <small>
                      🗓️ {ev.date || ev.event_date} | ⏰ {ev.time || ev.event_time}{" "}
                      {ev.location && `| 📍 ${ev.location}`}
                    </small>
                    {ev.description && <p className="admin-item-desc">{ev.description}</p>}
                  </div>
                </div>
                <div className="admin-item-actions">
                  <button onClick={() => handleEdit(ev)} className="edit-btn">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(ev.id)} className="del-btn">
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageEvents;