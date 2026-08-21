import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { useAdminYear } from "./AdminYearContext";
import AdminNavbar from "./AdminNavbar";
import "./ManageEvents.css";

function format12Hour(time24) {
  if (!time24) return "";
  const [hStr, mStr] = time24.split(":");
  let h = parseInt(hStr, 10);
  const m = mStr || "00";
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${String(h).padStart(2, "0")}:${m} ${ampm}`;
}

const SCHEDULE_MILESTONES = [
  {
    key: "pratishta",
    title: "గణపతి ప్రతిష్ట & పూజా ముహూర్తం",
    icon: "🪔",
    badge: "SACRED BEGINNING",
    isDaily: false,
    descHint: "Auspicious Madhyahna Ganapathi Homam & Pooja Muhurtham.",
  },
  {
    key: "daily_pooja",
    title: "నిత్య పూజ & హారతి (ఉదయం & సాయంత్రం)",
    icon: "☀️",
    badge: "EVERYDAY RITUALS (ప్రతిరోజూ)",
    isDaily: true,
    descHint: "Morning Abhishekham & Aarti, Evening Sandhya Deeparadhana & Bhajans daily.",
  },
  {
    key: "nimarjanam",
    title: "మహా నిమర్జనం & శోభాయాత్ర",
    icon: "🎵",
    badge: "SACRED IMMERSION & CELEBRATION",
    isDaily: false,
    descHint: "High-voltage DJ sound, non-stop youth dance celebrations, traditional Dappu beats, and grand visarjan procession.",
  },
];

function ManageSchedule() {
  const { activeYear } = useAdminYear();
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState(null);
  const [msg, setMsg] = useState("");

  const [scheduleData, setScheduleData] = useState({
    pratishta: {
      id: null,
      date: `${activeYear}-09-14`,
      start_time: "11:02",
      end_time: "13:31",
      description: "Auspicious Madhyahna Ganapathi Homam & Pooja Muhurtham.",
    },
    daily_pooja: {
      id: null,
      date: `${activeYear}-09-15`, // Valid date for Postgres
      start_time: "08:30",
      end_time: "19:30",
      description: "Morning Aarti at 08:30 AM & Evening Sandhya Harathi at 07:30 PM daily throughout the festival.",
    },
    nimarjanam: {
      id: null,
      date: `${activeYear}-09-24`,
      start_time: "15:00",
      end_time: "22:00",
      description: "High-voltage DJ sound, non-stop youth dance celebrations, traditional Dappu beats, and grand visarjan procession.",
    },
  });

  useEffect(() => {
    fetch3ScheduleItems();
  }, [activeYear]);

  async function fetch3ScheduleItems() {
    setLoading(true);
    setMsg("");

    const { data, error } = await supabase
      .from("schedule")
      .select("*")
      .eq("year", Number(activeYear));

    if (!error && data) {
      const nextData = { ...scheduleData };

      data.forEach((item) => {
        const title = (item.ritual_title || item.title || "").toLowerCase();
        let targetKey = null;

        if (title.includes("ప్రతిష్ట") || title.includes("pratishta") || item.day_number === 1) {
          targetKey = "pratishta";
        } else if (title.includes("నిత్య") || title.includes("daily") || title.includes("హారతి") || item.day_number === 2) {
          targetKey = "daily_pooja";
        } else if (title.includes("నిమర్జనం") || title.includes("nimarjanam") || item.day_number === 3) {
          targetKey = "nimarjanam";
        }

        if (targetKey) {
          const timeStr = item.muhurtham_time || item.time || "";
          const matches = timeStr.match(/(\d{1,2}:\d{2})/g);

          nextData[targetKey] = {
            id: item.id,
            date: item.date || nextData[targetKey].date,
            start_time: matches && matches[0] ? matches[0] : nextData[targetKey].start_time,
            end_time: matches && matches[1] ? matches[1] : nextData[targetKey].end_time,
            description: item.description || nextData[targetKey].description,
          };
        }
      });

      setScheduleData(nextData);
    }
    setLoading(false);
  }

  function handleFieldChange(typeKey, field, value) {
    setScheduleData((prev) => ({
      ...prev,
      [typeKey]: {
        ...prev[typeKey],
        [field]: value,
      },
    }));
  }

  async function handleSaveScheduleItem(typeKey, ritualTitle, dayNum) {
    setSavingKey(typeKey);
    setMsg("");

    const item = scheduleData[typeKey];
    let formattedTiming = "";

    if (typeKey === "daily_pooja") {
      const morningStr = format12Hour(item.start_time);
      const eveningStr = format12Hour(item.end_time);
      formattedTiming = `Morning: ${morningStr} | Evening: ${eveningStr}`;
    } else {
      const startFormatted = format12Hour(item.start_time);
      const endFormatted = item.end_time ? format12Hour(item.end_time) : "";
      formattedTiming = endFormatted
        ? `${startFormatted} – ${endFormatted} (${item.start_time} to ${item.end_time} hrs)`
        : `${startFormatted} (${item.start_time} hrs)`;
    }

    // Ensure date is a valid string date format YYYY-MM-DD
    const validDate = item.date && item.date !== "DAILY" ? item.date : `${activeYear}-09-15`;

    const payload = {
      day_number: dayNum,
      ritual_title: ritualTitle,
      muhurtham_time: formattedTiming,
      date: validDate,
      description: item.description.trim(),
      year: Number(activeYear),
    };

    let result;
    if (item.id) {
      result = await supabase.from("schedule").update(payload).eq("id", item.id);
    } else {
      result = await supabase.from("schedule").insert([payload]);
    }

    if (!result.error) {
      setMsg(`✅ "${ritualTitle}" details saved for ${activeYear}!`);
      fetch3ScheduleItems();
    } else {
      setMsg(`❌ Error saving: ${result.error.message}`);
    }
    setSavingKey(null);
  }

  return (
    <div className="admin-events-page">
      <AdminNavbar title={`Festival Schedule Setup (${activeYear})`} />

      {msg && <div className="admin-msg-banner">{msg}</div>}

      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <p style={{ color: "rgba(255,255,255,0.75)", marginBottom: "25px", fontSize: "0.95rem" }}>
          Configure the 3 core festival milestones for <strong>{activeYear}</strong>. Daily Pooja applies every day during the festival.
        </p>

        {loading ? (
          <p>Loading schedule details...</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {SCHEDULE_MILESTONES.map((type, idx) => {
              const current = scheduleData[type.key];
              const isSaving = savingKey === type.key;

              return (
                <div
                  key={type.key}
                  style={{
                    background: "rgba(255, 255, 255, 0.04)",
                    border: "1.5px solid rgba(245, 158, 11, 0.3)",
                    borderRadius: "18px",
                    padding: "24px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "18px" }}>
                    <span style={{ fontSize: "2rem" }}>{type.icon}</span>
                    <div>
                      <span style={{ fontSize: "10px", fontWeight: "800", letterSpacing: "1.5px", color: "#f59e0b" }}>
                        {type.badge} (STAGE #{idx + 1})
                      </span>
                      <h3 style={{ margin: "2px 0 0 0", color: "#fff", fontSize: "1.3rem" }}>
                        {type.title}
                      </h3>
                    </div>
                  </div>

                  <div className="admin-form-row">
                    <div className="admin-form-group">
                      <label>{type.isDaily ? "Occurrence" : "Date *"}</label>
                      {type.isDaily ? (
                        <div
                          style={{
                            padding: "12px 16px",
                            borderRadius: "12px",
                            background: "rgba(245, 158, 11, 0.1)",
                            border: "1.5px solid rgba(245, 158, 11, 0.3)",
                            color: "#fde68a",
                            fontWeight: "700",
                            fontSize: "0.95rem",
                          }}
                        >
                          🗓️ EVERY DAY (ప్రతిరోజూ)
                        </div>
                      ) : (
                        <input
                          type="date"
                          className="date-picker-input"
                          value={current.date}
                          onChange={(e) => handleFieldChange(type.key, "date", e.target.value)}
                          required
                        />
                      )}
                    </div>

                    <div className="admin-form-group">
                      <label>
                        {type.key === "pratishta" ? "Muhurtham Start Time *" : type.key === "daily_pooja" ? "Morning Pooja Time *" : "DJ & Procession Start Time *"}
                      </label>
                      <input
                        type="time"
                        className="time-picker-input"
                        value={current.start_time}
                        onChange={(e) => handleFieldChange(type.key, "start_time", e.target.value)}
                        required
                      />
                      <small style={{ color: "#f7d088", fontSize: "0.75rem", marginTop: "2px" }}>
                        Time: <strong>{format12Hour(current.start_time)}</strong>
                      </small>
                    </div>

                    <div className="admin-form-group">
                      <label>
                        {type.key === "pratishta" ? "Muhurtham End Time" : type.key === "daily_pooja" ? "Evening Sandhya Aarti Time *" : "Immersion End Time"}
                      </label>
                      <input
                        type="time"
                        className="time-picker-input"
                        value={current.end_time}
                        onChange={(e) => handleFieldChange(type.key, "end_time", e.target.value)}
                      />
                      {current.end_time && (
                        <small style={{ color: "#f7d088", fontSize: "0.75rem", marginTop: "2px" }}>
                          Time: <strong>{format12Hour(current.end_time)}</strong>
                        </small>
                      )}
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label>Description / Celebration Details</label>
                    <input
                      type="text"
                      placeholder={type.descHint}
                      value={current.description}
                      onChange={(e) => handleFieldChange(type.key, "description", e.target.value)}
                    />
                  </div>

                  <button
                    type="button"
                    className="admin-save-btn"
                    style={{ width: "auto", padding: "10px 24px" }}
                    onClick={() => handleSaveScheduleItem(type.key, type.title, idx + 1)}
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : `💾 Save ${type.title}`}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageSchedule;