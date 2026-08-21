import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./Schedule.css";

function parseScheduleTimestamp(dateStr, timeStr) {
  if (!dateStr) return null;

  let year, month, day;
  const str = String(dateStr).trim();

  if (str.includes("/")) {
    const parts = str.split("/");
    day = parseInt(parts[0], 10);
    month = parseInt(parts[1], 10) - 1;
    year = parseInt(parts[2], 10);
  } else if (str.includes("-")) {
    const parts = str.split("-");
    year = parseInt(parts[0], 10);
    month = parseInt(parts[1], 10) - 1;
    day = parseInt(parts[2], 10);
  } else {
    return null;
  }

  let hours = 11;
  let minutes = 0;
  if (timeStr) {
    const match = String(timeStr).match(/(\d{1,2}):(\d{2})/);
    if (match) {
      hours = parseInt(match[1], 10);
      minutes = parseInt(match[2], 10);
    }
  }

  return new Date(year, month, day, hours, minutes, 0);
}

function ScheduleCountdown({ isDaily, dateStr, timeStr }) {
  const [timeLeft, setTimeLeft] = useState({
    status: "CALCULATING",
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  if (isDaily) {
    return (
      <div className="countdown-pill daily-pill">
        <span className="pill-dot orange-dot"></span>
        <span>EVERY DAY • <strong>ప్రతిరోజూ</strong></span>
      </div>
    );
  }

  useEffect(() => {
    const targetDate = parseScheduleTimestamp(dateStr, timeStr);
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
        <strong>✓ CONCLUDED</strong>
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

const BADGE_MAP = {
  1: "STAGE 1 • SACRED BEGINNING",
  2: "STAGE 2 • EVERYDAY RITUALS",
  3: "STAGE 3 • GRAND VISARJAN & NIMARJANAM",
};

const ICONS_MAP = {
  1: "🪔",
  2: "☀️",
  3: "🎵",
};

function Schedule({ year }) {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSchedule() {
      setLoading(true);
      const numericYear = Number(year) || 2026;

      const { data, error } = await supabase
        .from("schedule")
        .select("*")
        .eq("year", numericYear)
        .in("day_number", [1, 2, 3])
        .order("day_number", { ascending: true });

      if (!error && data && data.length > 0) {
        setSchedules(data);
      } else {
        setSchedules([]);
      }
      setLoading(false);
    }

    if (year) {
      fetchSchedule();
    }
  }, [year]);

  return (
    <div className="festival-section schedule-section-wrapper" id="schedule">
      <div className="section-heading">
        <span>✦ SACRED PUJA TIMINGS &amp; RITUALS ✦</span>
        <h2>
          {year} <strong>FESTIVAL SCHEDULE</strong>
        </h2>
        <p>
          Receive the divine blessings of Lord Ganesha by participating in our Vedic Pratishtha, daily morning &amp; evening poojas, and grand Nimarjanam celebrations.
        </p>
      </div>

      {loading ? (
        <div className="empty-schedule-card">
          <span className="empty-icon">🪔</span>
          <p>Loading {year} festival schedule...</p>
        </div>
      ) : schedules.length === 0 ? (
        <div className="empty-schedule-card">
          <span className="empty-icon">🪔</span>
          <h3>Schedule Updating Soon</h3>
          <p>The 3 Vedic milestones for {year} will be published shortly by the committee.</p>
        </div>
      ) : (
        <div className="schedule-cards-grid">
          {schedules.map((item, index) => {
            const rawDate = item.date;
            const rawTime = item.muhurtham_time || item.time || "Morning: 08:30 AM | Evening: 07:30 PM";
            const dayNum = item.day_number || index + 1;
            const isDaily = dayNum === 2;

            return (
              <div key={item.id || index} className="schedule-item-card">
                <div className="schedule-card-top-row">
                  <span className="day-tag">{BADGE_MAP[dayNum] || `PROGRAM #${dayNum}`}</span>
                  <ScheduleCountdown isDaily={isDaily} dateStr={rawDate} timeStr={rawTime} />
                </div>

                <div className="ritual-title-wrapper">
                  <div className="ritual-icon-container">
                    <span className="ritual-icon">{ICONS_MAP[dayNum] || "🪔"}</span>
                  </div>
                  <h3>{item.ritual_title || item.title}</h3>
                </div>

                <div className="schedule-meta-bar">
                  <span className="meta-tag">
                    🗓️ <strong>Date:</strong> {isDaily ? "EVERY DAY (ప్రతిరోజూ)" : new Date(rawDate).toLocaleDateString("en-GB")}
                  </span>
                  <span className="meta-tag highlight-time">
                    ⏰ <strong>Timings:</strong> {rawTime}
                  </span>
                </div>

                {item.description && (
                  <p className="schedule-description">{item.description}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Schedule;