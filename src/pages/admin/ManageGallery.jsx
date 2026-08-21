import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { useAdminYear } from "./AdminYearContext";
import AdminNavbar from "./AdminNavbar";
import "./ManageEvents.css";

function ManageGallery() {
  const { activeYear } = useAdminYear();
  const [driveLink, setDriveLink] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetchDriveLink();
  }, [activeYear]);

  async function fetchDriveLink() {
    setLoading(true);
    setMsg("");

    const { data, error } = await supabase
      .from("festival_years")
      .select("drive_link")
      .eq("year", Number(activeYear))
      .maybeSingle();

    if (!error && data) {
      setDriveLink(data.drive_link || "");
    } else {
      setDriveLink("");
    }
    setLoading(false);
  }

  async function handleSaveDriveLink(e) {
    e.preventDefault();
    setSaving(true);
    setMsg("");

    const { error } = await supabase
      .from("festival_years")
      .update({ drive_link: driveLink.trim() })
      .eq("year", Number(activeYear));

    if (!error) {
      setMsg(`✅ Google Drive Gallery link saved for ${activeYear}!`);
    } else {
      setMsg(`❌ Error saving link: ${error.message}`);
    }
    setSaving(false);
  }

  return (
    <div className="admin-events-page">
      <AdminNavbar title={`Festival Gallery & Drive Link (${activeYear})`} />

      {msg && <div className="admin-msg-banner">{msg}</div>}

      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        <p style={{ color: "rgba(255,255,255,0.75)", marginBottom: "25px", fontSize: "0.95rem" }}>
          Paste the shared <strong>Google Drive Folder / Photos Link</strong> containing all the high-resolution event photos for <strong>{activeYear}</strong>.
        </p>

        {loading ? (
          <p>Loading Drive Link...</p>
        ) : (
          <form onSubmit={handleSaveDriveLink}>
            <div
              style={{
                background: "linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(25, 7, 2, 0.8))",
                border: "1.5px solid rgba(245, 158, 11, 0.4)",
                borderRadius: "20px",
                padding: "26px",
                marginBottom: "24px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "18px" }}>
                <span style={{ fontSize: "2rem" }}>📁</span>
                <div>
                  <span style={{ fontSize: "10px", fontWeight: "800", letterSpacing: "1.5px", color: "#f59e0b" }}>
                    GOOGLE DRIVE INTEGRATION
                  </span>
                  <h3 style={{ margin: "2px 0 0 0", color: "#fff" }}>Festival Photos Drive Link</h3>
                </div>
              </div>

              <div className="admin-form-group">
                <label>Google Drive Shared Folder / Album URL *</label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/drive/folders/..."
                  value={driveLink}
                  onChange={(e) => setDriveLink(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: "10px",
                    background: "rgba(0,0,0,0.5)",
                    border: "1px solid rgba(245,158,11,0.4)",
                    color: "#fff",
                  }}
                />
                <small style={{ color: "rgba(255,255,255,0.5)", display: "block", marginTop: "8px" }}>
                  💡 Ensure the link access is set to <strong>"Anyone with the link can view"</strong> in Google Drive.
                </small>
              </div>

              {driveLink && (
                <div style={{ marginTop: "14px" }}>
                  <a
                    href={driveLink}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color: "#fde68a",
                      fontSize: "0.85rem",
                      textDecoration: "underline",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    🔗 Test Open Drive Link ↗
                  </a>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="admin-save-btn"
              style={{ width: "100%", padding: "14px", fontSize: "1rem" }}
              disabled={saving}
            >
              {saving ? "Saving Link..." : `💾 Save ${activeYear} Drive Link`}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ManageGallery;