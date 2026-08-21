import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./Events.css";

// Helper function to parse dates formatted as YYYY-MM-DD or DD/MM/YYYY
function parseEventDateTime(dateStr, timeStr) {
  if (!dateStr) return null;

  let year, month, day;
  if (dateStr.includes("/")) {
    const parts = dateStr.split("/");
    day = parseInt(parts[0], 10);
    month = parseInt(parts[1], 10) - 1;
    year = parseInt(parts[2], 10);
  } else if (dateStr.includes("-")) {
    const parts = dateStr.split("-");
    year = parseInt(parts[0], 10);
    month = parseInt(parts[1], 10) - 1;
    day = parseInt(parts[2], 10);
  } else {
    return null;
  }

  let hours = 0;
  let minutes = 0;
  if (timeStr) {
    const match = timeStr.match(/(\d{1,2}):(\d{2})/);
    if (match) {
      hours = parseInt(match[1], 10);
      minutes = parseInt(match[2], 10);
    }
  }

  return new Date(year, month, day, hours, minutes, 0);
}

function EventCountdown({ dateStr, timeStr }) {
  const [timeLeft, setTimeLeft] = useState({
    status: "CALCULATING",
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = parseEventDateTime(dateStr, timeStr);
    if (!targetDate) {
      setTimeLeft({ status: "UNKNOWN" });
      return;
    }

    function calculate() {
      const now = new Date().getTime();
      const difference = targetDate.getTime() - now;

      if (difference <= 0) {
        setTimeLeft({ status: "COMPLETED" });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({
          status: "UPCOMING",
          days,
          hours,
          minutes,
          seconds,
        });
      }
    }

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [dateStr, timeStr]);

  if (timeLeft.status === "COMPLETED") {
    return (
      <div className="countdown-pill completed-pill">
        <span className="pill-dot green-dot"></span>
        <strong>✓ COMPLETED</strong>
      </div>
    );
  }

  if (timeLeft.status === "UPCOMING") {
    return (
      <div className="countdown-pill upcoming-pill">
        <span className="pill-dot orange-dot"></span>
        <span>
          Starts in:{" "}
          <strong>
            {timeLeft.days > 0 && `${timeLeft.days}d `}
            {String(timeLeft.hours).padStart(2, "0")}h{" "}
            {String(timeLeft.minutes).padStart(2, "0")}m{" "}
            {String(timeLeft.seconds).padStart(2, "0")}s
          </strong>
        </span>
      </div>
    );
  }

  return null;
}

function Events({ year }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);

      // 1. Get year record ID if using foreign keys
      const { data: yearData } = await supabase
        .from("festival_years")
        .select("id")
        .eq("year", Number(year))
        .maybeSingle();

      // 2. Fetch all events matching either year or festival_year_id
      let query = supabase.from("events").select("*");
      if (yearData?.id) {
        query = query.or(`year.eq.${Number(year)},festival_year_id.eq.${yearData.id}`);
      } else {
        query = query.eq("year", Number(year));
      }

      const { data, error } = await query;

      if (!error && data) {
        setEvents(data);
      } else {
        setEvents([]);
      }

      setLoading(false);
    }

    if (year) {
      fetchEvents();
    }
  }, [year]);

  return (
    <div className="festival-section events-section-wrapper" id="events">
      <div className="section-heading">
        <span>✦ CULTURAL &amp; SPECIAL HIGHLIGHTS ✦</span>
        <h2>
          {year} <strong>MAHOTSAV EVENTS</strong>
        </h2>
        <p>Discover bhajans, music nights, cultural programs, and grand celebrations.</p>
      </div>

      {loading ? (
        <div className="empty-events-card">
          <span className="empty-icon">🪔</span>
          <p>Loading {year} events...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="empty-events-card">
          <span className="empty-icon">🎉</span>
          <h3>Events Schedule Coming Soon</h3>
          <p>The cultural lineup and special programs for {year} will be announced soon.</p>
        </div>
      ) : (
        <div className="events-cards-grid">
          {events.map((item, index) => {
            const rawDate = item.date || item.event_date || "";
            const rawTime = item.time || item.event_time || "";

            return (
              <div key={item.id || index} className="event-item-card">
                <div className="event-card-top-row">
                  <span className="event-emoji-icon">{item.icon || "🎉"}</span>
                  <EventCountdown dateStr={rawDate} timeStr={rawTime} />
                </div>

                <h3>{item.title}</h3>

                <div className="event-meta-bar">
                  {rawDate && <span className="meta-tag">📅 {rawDate}</span>}
                  {rawTime && <span className="meta-tag">⏰ {rawTime.slice(0, 5)} hrs</span>}
                  {item.location && <span className="meta-tag">📍 {item.location}</span>}
                </div>

                {item.description && <p className="event-description">{item.description}</p>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Events;