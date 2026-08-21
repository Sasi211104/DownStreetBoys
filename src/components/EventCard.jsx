function EventCard({ date, title, time, description }) {
  return (
    <div className="event-card">

      <div className="event-date">
        {date}
      </div>

      <div className="event-info">
        <h3>{title}</h3>

        <p className="event-time">
          🕐 {time}
        </p>

        <p>
          {description}
        </p>
      </div>

    </div>
  );
}

export default EventCard;