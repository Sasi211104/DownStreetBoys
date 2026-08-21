import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./Gallery.css";

function Gallery({ year }) {
  const [driveLink, setDriveLink] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDriveLink() {
      setLoading(true);
      const numericYear = Number(year) || 2026;

      const { data, error } = await supabase
        .from("festival_years")
        .select("drive_link")
        .eq("year", numericYear)
        .maybeSingle();

      if (!error && data) {
        setDriveLink(data.drive_link || "");
      } else {
        setDriveLink("");
      }
      setLoading(false);
    }

    if (year) {
      fetchDriveLink();
    }
  }, [year]);

  return (
    <div className="festival-section gallery-section-wrapper" id="gallery">
      {/* Section Header */}
      <div className="section-heading">
        <span>✦ DIVINE MEMORIES &amp; CELEBRATIONS ✦</span>
        <h2>
          {year} <strong>FESTIVAL GALLERY</strong>
        </h2>
        <p>
          Relive the divine poojas, traditional Dappu beats, high-voltage DJ dances, and grand visarjan moments of DSB Gorapalli.
        </p>
      </div>

      {loading ? (
        <div className="gallery-loader-card">
          <div className="gallery-spinner"></div>
          <p>Loading {year} festive memories...</p>
        </div>
      ) : driveLink ? (
        <div className="gallery-showcase-container">
          <div className="gallery-premium-card">
            {/* Background Ambient Glows */}
            <div className="card-ambient-glow glow-1"></div>
            <div className="card-ambient-glow glow-2"></div>

            {/* Top Badge & Floating Icon */}
            <div className="gallery-top-badge-row">
              <span className="gallery-pill-tag">
                <span className="live-dot"></span> OFFICIAL CLOUD ALBUM
              </span>
              <span className="year-pill">{year} ARCHIVE</span>
            </div>

            {/* Central Icon */}
            <div className="gallery-main-icon-wrap">
              <div className="gallery-icon-halo"></div>
              <div className="gallery-icon-box">
                <span className="gallery-hero-emoji">📸</span>
              </div>
            </div>

            {/* Content Details */}
            <div className="gallery-details">
              <h3>{year} DSB Vinayaka Mahotsav Gallery</h3>
              <p>
                Access original, full-resolution HD photographs, immersion videos, and cultural event snapshots stored securely on Google Drive.
              </p>

              {/* Feature Chips */}
              <div className="gallery-chips-row">
                <div className="gallery-chip">
                  <span className="chip-icon">✨</span>
                  <span>Full HD &amp; 4K</span>
                </div>
                <div className="gallery-chip">
                  <span className="chip-icon">⚡</span>
                  <span>Fast Access</span>
                </div>
                <div className="gallery-chip">
                  <span className="chip-icon">📥</span>
                  <span>Direct Download</span>
                </div>
              </div>
            </div>

            {/* Interactive Open Drive CTA */}
            <div className="gallery-action-box">
              <a
                href={driveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="gallery-drive-cta"
              >
                <span className="cta-icon">📁</span>
                <span className="cta-label">Open Google Drive Album</span>
                <span className="cta-arrow">↗</span>
              </a>
              <span className="cta-subtext">No login required • Free full album access</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="empty-gallery-card">
          <div className="empty-icon-wrap">
            <span className="empty-icon">📷</span>
          </div>
          <h3>Gallery Updating Soon</h3>
          <p>
            The official Google Drive album for <strong>{year}</strong> will be published by the organizing committee right after the celebrations.
          </p>
        </div>
      )}
    </div>
  );
}

export default Gallery;