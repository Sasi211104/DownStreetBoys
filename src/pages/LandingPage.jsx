import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./LandingPage.css";

function LandingPage() {
  const navigate = useNavigate();

  // ==============================
  // STATE
  // ==============================
  const [showYears, setShowYears] = useState(false);
  const [years, setYears] = useState([]);
  const [loadingYears, setLoadingYears] = useState(false);
  const [yearError, setYearError] = useState("");

  // ==============================
  // FETCH YEARS FROM SUPABASE
  // ==============================
  useEffect(() => {
    fetchFestivalYears();
  }, []);

  async function fetchFestivalYears() {
    setLoadingYears(true);
    setYearError("");

    const { data, error } = await supabase
      .from("festival_years")
      .select("*")
      .eq("is_active", true)
      .order("year", { ascending: false });

    if (error) {
      console.error("Festival year error:", error);
      setYearError("Unable to load festival years. Please try again.");
      setLoadingYears(false);
      return;
    }

    setYears(data || []);
    setLoadingYears(false);
  }

  // ==============================
  // YEAR SELECTION
  // ==============================
  function handleYearSelect(year) {
    setShowYears(false);
    navigate(`/festival/${year}`);
  }

  // ==============================
  // CLOSE YEAR SELECTOR
  // ==============================
  function closeYearSelector() {
    setShowYears(false);
  }

  return (
    <div className="landing-page">
      {/* =========================================
          BACKGROUND GLOWS
      ========================================= */}
      <div className="landing-glow landing-glow-one"></div>
      <div className="landing-glow landing-glow-two"></div>

      {/* =========================================
          NAVBAR
      ========================================= */}
      <header className="landing-navbar">
        {/* BRAND */}
        <div className="dsb-brand">
          <div className="dsb-logo">
            <img src="/images/logo.png" alt="DSB Logo" />
          </div>
          <div className="brand-text">
            <h2>DSB VINAYAKA MAHOTSAV</h2>
            <span>DOWN STREET BOYS</span>
          </div>
        </div>

        {/* NAV ACTIONS (INSTAGRAM & SIGN IN) */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <a
            href="https://www.instagram.com/down.street.boys"
            target="_blank"
            rel="noopener noreferrer"
            className="landing-instagram-btn"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
              padding: "9px 16px",
              borderRadius: "50px",
              background: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(245, 158, 11, 0.35)",
              color: "#fde68a",
              textDecoration: "none",
              fontSize: "13px",
              fontWeight: "700",
              backdropFilter: "blur(8px)",
              transition: "all 0.25s ease",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
            <span>Instagram</span>
          </a>

          <button
            className="sign-in-btn"
            onClick={() => navigate("/admin")}
          >
            SIGN IN
          </button>
        </div>
      </header>

      {/* =========================================
          HERO
      ========================================= */}
      <main className="landing-hero">
        <div className="festival-container">
          {/* =====================================
              GANESH / SWING AREA
          ===================================== */}
          <div className="swing-wrapper">
            {/* ===================================
                CONTENT ON GANESH IMAGE
            =================================== */}
            <div className="swing-inner-content">
              <div className="welcome-tag">
                ✦ WELCOME TO OUR FESTIVAL ✦
              </div>

              <h1 className="hero-title">
                DSB VINAYAKA
                <span>MAHOTSAV</span>
              </h1>

              <div className="festival-location">
                DOWN STREET BOYS • GORAPALLI
              </div>

              {/* =================================
                  JOIN CELEBRATION
              ================================= */}
              <button
                className="enter-festival-btn"
                onClick={() => setShowYears(true)}
              >
                JOIN CELEBRATION
                <span>→</span>
              </button>
            </div>

            {/* GANESH GLOW */}
            <div className="ganesh-glow"></div>

            {/* GANESH IMAGE */}
            <img
              src="/images/ganeshimage.png"
              alt="Lord Ganesha on Swing"
              className="ganesh-swing-img"
            />
          </div>

          {/* =====================================
              BLESSING
          ===================================== */}
          <p className="blessing-line">
            Celebrating devotion, unity, and divine blessings.
          </p>
        </div>
      </main>

      {/* =========================================
          FOOTER
      ========================================= */}
      <footer className="landing-footer">
        <span>ॐ</span>
        <p>GANPATI BAPPA MORYA</p>
        <span>ॐ</span>
      </footer>

      {/* =========================================
          YEAR SELECTION MODAL
      ========================================= */}
      {showYears && (
        <div className="year-overlay" onClick={closeYearSelector}>
          <div
            className="year-selection-card"
            onClick={(event) => event.stopPropagation()}
          >
            {/* CLOSE BUTTON */}
            <button
              className="year-close-btn"
              onClick={closeYearSelector}
              aria-label="Close"
            >
              ×
            </button>

            {/* OM SYMBOL */}
            <div className="year-symbol">ॐ</div>

            {/* SMALL TITLE */}
            <p className="year-small-title">DSB VINAYAKA MAHOTSAV</p>

            {/* TITLE */}
            <h2>Select Year</h2>

            {/* DESCRIPTION */}
            <p className="year-description">
              Choose a year to explore the celebrations, events, gallery and memories.
            </p>

            {/* YEAR CONTENT */}
            {loadingYears ? (
              <div className="year-loading">Loading festival years...</div>
            ) : yearError ? (
              <div className="year-error">
                <p>{yearError}</p>
                <button onClick={fetchFestivalYears}>TRY AGAIN</button>
              </div>
            ) : years.length === 0 ? (
              <div className="year-error">No festival years available.</div>
            ) : (
              <div className="year-grid">
                {years.map((item) => (
                  <button
                    key={item.id}
                    className={`year-btn ${
                      Number(item.year) === 2026 ? "current-year" : ""
                    }`}
                    onClick={() => handleYearSelect(item.year)}
                  >
                    <span>{item.year}</span>
                    {Number(item.year) === 2026 && <small>CURRENT</small>}
                  </button>
                ))}
              </div>
            )}

            {/* BOTTOM TEXT */}
            <p className="year-bottom-text">✦ Ganpati Bappa Morya ✦</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default LandingPage;