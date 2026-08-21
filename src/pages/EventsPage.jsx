import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

function Events({ year }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);

      // 1. Fetch Year ID
      const { data: yearData } = await supabase
        .from("festival_years")
        .select("id")
        .eq("year", Number(year))
        .single();

      if (yearData?.id) {
        // 2. Fetch Events for that Year ID
        const { data: eventsData, error } = await supabase
          .from("events")
          .select("*")
          .eq("festival_year_id", yearData.id)
          .order("display_order", { ascending: true });

        if (!error) {
          setEvents(eventsData || []);
        }
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
    <div className="festival-section">
      <div className="section-heading">
        <span>✦ FESTIVAL PROGRAM ✦</span>
        <h2>
          {year} <strong>EVENTS</strong>
        </h2>
        <p>Experience the celebrations and special events of DSB Vinayaka Mahotsav.</p>
      </div>

      {loading ? (
        <div className="loading-box">Loading festival events...</div>
      ) : events.length === 0 ? (
        <div className="empty-box">
          <span>🎉</span>
          <h3>No Events Added Yet</h3>
          <p>Events for {year} will be updated soon.</p>
        </div>
      ) : (
        <div className="events-grid">
          {events.map((event, index) => (
            <article className="event-card" key={event.id || index}>
              <div className="event-number">{String(index + 1).padStart(2, "0")}</div>
              <div className="event-icon">{event.icon || "🎉"}</div>
              <div className="event-info">
                <h3>{event.title}</h3>
                {event.description && <p>{event.description}</p>}
                <div className="event-meta">
                  {event.event_date && <span>📅 {event.event_date}</span>}
                  {event.event_time && <span>⏰ {event.event_time}</span>}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default Events;