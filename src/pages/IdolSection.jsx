import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./IdolSection.css";

function IdolSection({ year }) {
  const [sponsorData, setSponsorData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchIdolSponsor() {
      setLoading(true);
      const numericYear = Number(year) || 2026;

      const { data, error } = await supabase
        .from("idol_details")
        .select("*")
        .eq("year", numericYear)
        .maybeSingle();

      if (!error && data && (data.sponsor_name || data.image_url)) {
        setSponsorData(data);
      } else {
        setSponsorData(null);
      }
      setLoading(false);
    }

    if (year) {
      fetchIdolSponsor();
    }
  }, [year]);

  return (
    <div className="festival-section idol-section-wrapper" id="idol">
      <div className="section-heading">
        <span>✦ SACRED VIGRAHAM &amp; DEVOTION ✦</span>
        <h2>
          {year} <strong>DIVINE GANAPATHI IDOL &amp; SPONSOR</strong>
        </h2>
        <p>
          Heartfelt gratitude to our noble idol sponsor for presenting the sacred murti for {year} DSB Vinayaka Mahotsav.
        </p>
      </div>

      {loading ? (
        <div className="empty-idol-card">
          <span className="empty-idol-icon">⏳</span>
          <p>Loading {year} Idol &amp; Sponsor details...</p>
        </div>
      ) : sponsorData ? (
        <div className="idol-card-container">
          {/* Left: That Year's Idol Image */}
          <div className="idol-image-frame">
            <div className="idol-glow-effect"></div>
            <img
              src={sponsorData.image_url || "/images/mainganesh.png"}
              alt={`${year} Ganesh Idol`}
              className="idol-display-img"
            />
          </div>

          {/* Right: Main Idol Sponsor Box */}
          <div className="idol-info-panel">
            <div className="idol-header">
              <span className="idol-sub">DSB GORAPALLI • {year} IDOL SPONSOR</span>
              <h3>Lord Ganesha Divine Idol Sponsor</h3>
            </div>

            <div className="idol-sponsor-box">
              <div className="sponsor-icon-wrapper">
                <img
                  src="/images/orangeganesh.png"
                  alt="Lord Ganesha Icon"
                  className="sponsor-ganesh-logo"
                />
              </div>

              <div className="sponsor-text">
                <span className="sponsor-tag-badge">MAIN IDOL SPONSOR (విగ్రహ దాత)</span>
                <h4>{sponsorData.sponsor_name}</h4>
                <p>
                  శ్రీ విఘ్నేశ్వరుని కృపాకటాక్షాలతో దాతల కుటుంబానికి ఆయురారోగ్యాలు, అష్టైశ్వర్యాలు కలగాలని ప్రార్థిస్తున్నాము.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Coming Soon State when deleted or empty */
        <div className="empty-idol-card">
          <div className="empty-idol-icon-wrap">
            <img
              src="/images/orangeganesh.png"
              alt="Lord Ganesha Icon"
              className="empty-ganesh-logo"
            />
          </div>
          <span className="empty-idol-badge">REVEALING SOON</span>
          <h3>{year} Idol &amp; Sponsor Details</h3>
          <p>
            The sacred Ganapathi idol darshan photo and the official sponsor devotee announcement for <strong>{year}</strong> will be unveiled shortly by the committee.
          </p>
        </div>
      )}
    </div>
  );
}

export default IdolSection;