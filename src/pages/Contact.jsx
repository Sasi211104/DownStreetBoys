import React from "react";
import "./Contact.css";

function Contact() {
  const MAPS_URL =
    "https://www.google.com/maps/place//@17.8340066,83.1773727,18.51z?entry=ttu&g_ep=EgoyMDI2MDgxNy4wIKXMDSoASAFQAw%3D%3D";

  // Coordinator Details
  const coordinator = {
    role: "EVENT COORDINATOR",
    name: "Monday Varaprasad",
    phone: "+91 9703779599",
    displayPhone: "+91 9703779599",
    badge: "🌟 Main In-Charge",
  };

  // 4 Organizers Details
  const organizers = [
    {
      role: "ORGANIZER",
      name: "Pandu",
      phone: "+91 6281331327",
      displayPhone: "+91 6281331327",
      tag: "Pooja & Rituals",
    },
    {
      role: "ORGANIZER",
      name: "Kalimi Vamsi",
      phone: "+91 7032075431",
      displayPhone: "+91 7032075431",
      tag: "Annadanam Seva",
    },
    {
      role: "ORGANIZER",
      name: "Sasikanth Bobbara",
      phone: "+91 7981601139",
      displayPhone: "+91 7981601139",
      tag: "Cultural & Stage",
    },
    {
      role: "ORGANIZER",
      name: "G.Manikanta",
      phone: "+91 8978550107",
      displayPhone: "+91 98765 43214",
      tag: "Procession & Safety",
    },
  ];

  return (
    <div className="festival-section contact-section-wrapper" id="contact">
      {/* Section Heading */}
      <div className="section-heading">
        <span>✦ GET IN TOUCH WITH US ✦</span>
        <h2>
          FESTIVAL <strong>COMMITTEE & LOCATION</strong>
        </h2>
        <p>
          For pooja timings, sevas, Annadanam participation, or location assistance,
          contact our committee coordinators and organizers below.
        </p>
      </div>

      {/* ================= 1. COORDINATOR CARD (WITH GANESH ICON) ================= */}
      <div className="coordinator-card-container">
        <div className="coordinator-card">
          <div className="coordinator-badge">{coordinator.badge}</div>
          <div className="coordinator-header">
            {/* Lord Ganesha Image Avatar */}
            <div className="ganesh-avatar-wrapper">
              <img
                src="/images/orangeganesh.png"
                alt="Lord Ganesha"
                className="ganesh-avatar-img"
              />
            </div>

            <div className="coordinator-info">
              <span className="role-tag">✦ {coordinator.role} ✦</span>
              <h3>{coordinator.name}</h3>
              <p>Overall Festival Supervision &amp; Seva In-Charge</p>
            </div>
          </div>

          <div className="contact-actions-row">
            <a href={`tel:${coordinator.phone}`} className="btn-call">
              📞 Call: {coordinator.displayPhone}
            </a>
            <a
              href={`https://wa.me/${coordinator.phone.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
            >
              💬 WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* ================= 2. 4 ORGANIZERS GRID (WITH GANESH ICONS) ================= */}
      <h3 className="sub-section-title">🕉️ Organizing Committee Members</h3>
      <div className="organizers-grid">
        {organizers.map((org, index) => (
          <div key={index} className="organizer-card">
            <div className="org-top-row">
              {/* Lord Ganesha Icon */}
              <div className="org-ganesh-icon-wrapper">
                <img
                  src="/images/orangeganesh.png"
                  alt="Lord Ganesha"
                  className="org-ganesh-img"
                />
              </div>
              <span className="org-tag">{org.tag}</span>
            </div>

            <h4>{org.name}</h4>
            <span className="org-role-label">{org.role}</span>

            <div className="org-buttons-row">
              <a href={`tel:${org.phone}`} className="org-call-btn">
                📞 Call
              </a>
              <a
                href={`https://wa.me/${org.phone.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="org-wa-btn"
              >
                💬 WhatsApp
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* ================= 3. MAP LOCATION & SOCIALS ================= */}
      <div className="location-social-grid">
        {/* Google Maps Location Box */}
        <div className="contact-info-card location-card">
          <div className="card-icon-header">
            <span className="big-icon">📍</span>
            <div>
              <span className="card-subtext">PANDAL LOCATION</span>
              <h3>DSB Mandapam, Gorapalli</h3>
            </div>
          </div>

          <p>
            Down Street Boys (DSB), Gorapalli Village, Visakhapatnam District,
            Andhra Pradesh.
          </p>

          <a
            href="https://maps.app.goo.gl/iPc5zf8ojPgmL6QHA"
            target="_blank"
            rel="noopener noreferrer"
            className="maps-direction-btn"
          >
            🗺️ Open in Google Maps →
          </a>
        </div>

        {/* Instagram & Email Box */}
        <div className="contact-info-card social-card">
          <div className="card-icon-header">
            <span className="big-icon">📸</span>
            <div>
              <span className="card-subtext">ONLINE CONNECT</span>
              <h3>Follow &amp; Tag Us</h3>
            </div>
          </div>

          <p>
            Follow our official page for live daily harathi updates, reels, and festival
            highlights.
          </p>

          <div className="social-links-group">
            <a
              href="https://www.instagram.com/down.street.boys"
              target="_blank"
              rel="noopener noreferrer"
              className="social-btn instagram-link"
            >
              <span>📷 @down.street.boys</span>
              <small>Follow on Instagram →</small>
            </a>
            <a
              href="mailto:downstreetboys.dsb@gmail.com"
              className="social-btn email-link"
            >
              <span>📧 downstreetboys.dsb@gmail.com</span>
              <small>Send Email →</small>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;