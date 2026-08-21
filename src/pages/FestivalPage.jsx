import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Schedule from "./Schedule";
import IdolSection from "./IdolSection";
import Events from "./Events";
import Gallery from "./GalleryPage";
import Donations from "./Donations";
import About from "./About";
import Contact from "./Contact";
import PoojaStorySection from "./PoojaStorySection";

import "./FestivalYearPage.css";


function FestivalPage() {
  const navigate = useNavigate();
  const { year } = useParams();

  const [showYearModal, setShowYearModal] = useState(false);
  const selectedYear = Number(year);
  const yearsList = [2026, 2025, 2024, 2023];

  if (!yearsList.includes(selectedYear)) {
    return (
      <div className="festival-error-page">
        <div className="festival-error-card">
          <div className="error-symbol">🙏</div>
          <h1>Festival Year Not Found</h1>
          <p>Please select a valid DSB Vinayaka Mahotsav year.</p>
          <button onClick={() => navigate("/")}>← BACK TO HOME</button>
        </div>
      </div>
    );
  }

  // Robust smooth scroll with fixed navbar offset
  function scrollToSection(id) {
    const section = document.getElementById(id);
    if (section) {
      const navbarHeight = 85;
      const elementPosition = section.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  }

  function handleYearChange(newYear) {
    setShowYearModal(false);
    navigate(`/festival/${newYear}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="festival-page">
      <div className="festival-bg-glow glow-left"></div>
      <div className="festival-bg-glow glow-right"></div>
      <div className="festival-bg-glow glow-center"></div>

      {/* ================= NAVBAR ================= */}
      <header className="festival-navbar">
        <div className="festival-brand" onClick={() => navigate("/")}>
          <img src="/images/logo.png" alt="DSB Logo" className="festival-logo" />
          <div className="festival-brand-text">
            <h2>DSB VINAYAKA MAHOTSAV</h2>
            <span>DOWN STREET BOYS • GORAPALLI</span>
          </div>
        </div>

        <nav className="festival-nav-links">
          <button className="nav-link-btn" onClick={() => navigate("/")}>
            HOME
          </button>
          <button
            className="nav-link-btn highlight-nav-btn"
            onClick={() => scrollToSection("idol")}
          >
            IDOL SPONSOR
          </button>
          <button className="nav-link-btn" onClick={() => scrollToSection("about")}>
            ABOUT
          </button>
          <button className="nav-link-btn" onClick={() => scrollToSection("contact")}>
            CONTACT
          </button>

          <a
            href="https://www.instagram.com/down.street.boys"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-instagram-btn"
          >
            <svg viewBox="0 0 24 24" className="ig-icon" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
            <span>Instagram</span>
          </a>

          <div className="year-pill">{selectedYear}</div>
          <button className="back-years-btn" onClick={() => setShowYearModal(true)}>
            YEARS
          </button>
        </nav>
      </header>

      {/* ================= HERO ================= */}
      <section className="festival-hero">
        <div className="hero-particles">
          <span>✦</span><span>✧</span><span>✦</span><span>✧</span><span>✦</span>
        </div>

        <div className="festival-hero-content">
          <div className="hero-small-text">✦ DSB VINAYAKA MAHOTSAV ✦</div>
          <div className="hero-year">{selectedYear}</div>
          <h1>GANPATI <span>BAPPA MORYA</span></h1>
          <p>Celebrating devotion, unity, tradition, and the divine blessings of Lord Ganesha.</p>
          <div className="hero-location">DOWN STREET BOYS • GORAPALLI</div>

          {/* Hero Action Buttons */}
          <div className="hero-buttons">
            <button className="gold-btn" onClick={() => scrollToSection("schedule")}>
              EXPLORE SCHEDULE →
            </button>

            <button className="outline-btn" onClick={() => scrollToSection("chanda")}>
              SUPPORT CHANDA
            </button>

            <button
              className="outline-btn"
              onClick={() => scrollToSection("pooja-vidhanam")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                borderColor: "#f59e0b",
                color: "#fde68a",
                background: "rgba(245, 158, 11, 0.12)",
              }}
            >
              
              <span>CHANTS &amp; KATHA </span>
            </button>
          </div>
        </div>

        <div className="hero-ganesh">
          <div className="ganesh-halo"></div>
          <img src="/images/mainganesh.png" alt="Lord Ganesha" />
        </div>
      </section>

      {/* ================= QUICK MENU ================= */}
      <section className="quick-menu">
        <button onClick={() => scrollToSection("schedule")}>
          <img src="/images/scheduleicon.png" alt="Schedule" className="menu-custom-icon" />
          <strong>SCHEDULE</strong>
          <small>Festival Program</small>
        </button>

        <button onClick={() => scrollToSection("events")}>
          <img src="/images/eventsicon.png" alt="Events" className="menu-custom-icon" />
          <strong>EVENTS</strong>
          <small>Festival Events</small>
        </button>

        

        <button onClick={() => scrollToSection("gallery")}>
          <img src="/images/galleryicon.png" alt="Gallery" className="menu-custom-icon" />
          <strong>GALLERY</strong>
          <small>Festival Memories</small>
        </button>

        <button onClick={() => scrollToSection("chanda")}>
          <img src="/images/chandaicon.png" alt="Chanda" className="menu-custom-icon" />
          <strong>CHANDA</strong>
          <small>Support Festival</small>
        </button>

        <button onClick={() => scrollToSection("contact")}>
          <span className="menu-emoji-icon">📞</span>
          <strong>CONTACT</strong>
          <small>Reach Us</small>
        </button>
      </section>

      {/* ================= MODULAR SECTIONS ================= */}
      <section id="schedule">
        <Schedule year={selectedYear} />
      </section>

      <section id="idol">
        <IdolSection year={selectedYear} />
      </section>

      <section id="events">
        <Events year={selectedYear} />
      </section>

      <section id="pooja-vidhanam">
        <PoojaStorySection />
      </section>

      <section id="gallery">
        <Gallery year={selectedYear} />
      </section>

      <section id="chanda">
        <Donations year={selectedYear} />
      </section>

      <section id="about">
        <About year={selectedYear} />
      </section>

      <section id="contact">
        <Contact year={selectedYear} />
      </section>

      {/* ================= FINAL BLESSING ================= */}
      <section className="final-blessing">
        <div className="blessing-symbol">ॐ</div>
        <h2>GANPATI BAPPA</h2>
        <h3>MORYA!</h3>
        <p>May Lord Ganesha bless DSB, Gorapalli, and every family with happiness, prosperity, and peace.</p>
        <button onClick={() => setShowYearModal(true)}>← EXPLORE OTHER YEARS</button>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="festival-footer">
        <div className="footer-logo">
          <img src="/images/logo.png" alt="DSB" />
          <div>
            <strong>DSB VINAYAKA MAHOTSAV</strong>
            <span>DOWN STREET BOYS • GORAPALLI</span>
          </div>
        </div>
        <div className="footer-center">ॐ GANPATI BAPPA MORYA ॐ</div>
        <div className="footer-year">{selectedYear}</div>
      </footer>

      {/* ================= YEAR MODAL ================= */}
      {showYearModal && (
        <div className="year-overlay" onClick={() => setShowYearModal(false)}>
          <div className="year-selection-card" onClick={(e) => e.stopPropagation()}>
            <button className="year-close-btn" onClick={() => setShowYearModal(false)}>×</button>
            <div className="year-symbol">ॐ</div>
            <p className="year-small-title">DSB VINAYAKA MAHOTSAV</p>
            <h2>SELECT YEAR</h2>
            <p className="year-description">Choose a year to explore celebrations, events, and memories.</p>

            <div className="year-grid">
              {yearsList.map((festivalYear) => (
                <button
                  key={festivalYear}
                  className={`year-btn ${festivalYear === selectedYear ? "current-year" : ""}`}
                  onClick={() => handleYearChange(festivalYear)}
                >
                  <span>{festivalYear}</span>
                  {festivalYear === selectedYear && <small>CURRENT</small>}
                </button>
              ))}
            </div>
            <p className="year-bottom-text">✦ GANPATI BAPPA MORYA ✦</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default FestivalPage;