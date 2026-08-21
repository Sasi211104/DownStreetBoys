import React from "react";
import "./About.css";

function About() {
  return (
    <div className="festival-section about-section-wrapper" id="about">
      <div className="section-heading">
        <span>✦ OUR TRADITION &amp; HERITAGE ✦</span>
        <h2>
          ABOUT <strong>DSB VINAYAKA MAHOTSAV</strong>
        </h2>
        <p>
          Celebrating devotion, unity, and cultural vibrancy with sacred Vedic traditions.
        </p>
      </div>

      <div className="about-grid">
        {/* Card 1: Committee & Mission */}
        <div className="about-card">
          <div className="about-image-wrapper">
            <img
              src="/images/mainganesh.png"
              alt="DSB Vinayaka Mahotsav Committee"
              className="committee-img"
            />
            <span className="about-image-badge">✦ DOWN STREET BOYS • GORAPALLI ✦</span>
          </div>

          <div className="about-card-body">
            <div className="about-card-title-row">
              <span className="about-badge-icon">🪔</span>
              <div>
                <span className="about-sub-title">OUR SACRED MISSION</span>
                <h3>Devotion, Unity &amp; Seva</h3>
              </div>
            </div>

            <p>
              Organized with immense reverence by the <strong>Down Street Boys (DSB)</strong> in Gorapalli,
              our annual Vinayaka Mahotsav unites devotees across generations through traditional Vedic
              rituals, daily aartis, and community service.
            </p>

            <p>
              Every edition features our sacred <strong>Maha Annadanam</strong>, cultural talent stages,
              and our grand traditional Visarjan procession.
            </p>

            <div className="about-values-list">
              <span className="val-chip">✦ Vedic Poojas</span>
              <span className="val-chip">✦ Maha Annadanam</span>
              <span className="val-chip">✦ Cultural Stage</span>
              <span className="val-chip">✦ Grand Visarjan</span>
            </div>
          </div>
        </div>

        {/* Card 2: Divine Significance & Shloka */}
        <div className="about-card">
          <div className="about-card-body" style={{ height: "100%" }}>
            <div className="about-card-title-row">
              <div className="about-badge-icon-wrap">
                <img
                  src="/images/orangeganesh.png"
                  alt="Ganesh Logo"
                  className="about-ganesh-icon"
                />
              </div>
              <div>
                <span className="about-sub-title">SACRED BLESSINGS</span>
                <h3>Sri Vighnaharta</h3>
              </div>
            </div>

            {/* Telugu Ganesha Shloka */}
            <div className="ganesh-shloka-banner">
              <p className="shloka-telugu">
                "శుక్లాంబరధరం విష్ణుం శశివర్ణం చతుర్భుజం |<br />
                ప్రసన్నవదనం ధ్యాయేత్ సర్వ విఘ్నోపశాంతయే ||"
              </p>
              <span className="shloka-meaning">
                May the Lord clad in white, radiant as the moon, remove all obstacles from our lives.
              </span>
            </div>

            <p>
              Lord Ganesha symbolizes wisdom, auspicious beginnings, and the removal of obstacles.
              Our mandapam serves as a holy sanctuary where devotees gather in pure bhakti to offer
              prayers, chant stotrams, and seek divine grace.
            </p>

            <div className="divine-attributes-grid">
              <div className="attribute-box">
                <strong>బుద్ధి (Buddhi)</strong>
                <small>Wisdom &amp; Intellect</small>
              </div>
              <div className="attribute-box">
                <strong>సిద్ధి (Siddhi)</strong>
                <small>Success &amp; Prosperity</small>
              </div>
              <div className="attribute-box">
                <strong>శాంతి (Shanti)</strong>
                <small>Peace &amp; Well-being</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;