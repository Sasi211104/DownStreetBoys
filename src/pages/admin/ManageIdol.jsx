import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../../supabaseClient";
import { useAdminYear } from "./AdminYearContext";
import AdminNavbar from "./AdminNavbar";
import "./ManageEvents.css";

function ManageIdol() {
  const { activeYear } = useAdminYear();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [msg, setMsg] = useState("");

  const [sponsorName, setSponsorName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [hasRecord, setHasRecord] = useState(false);

  useEffect(() => {
    fetchIdolDetails();
  }, [activeYear]);

  async function fetchIdolDetails() {
    setLoading(true);
    setMsg("");

    try {
      const { data, error } = await supabase
        .from("idol_details")
        .select("*")
        .eq("year", Number(activeYear))
        .maybeSingle();

      if (!error && data) {
        setSponsorName(data.sponsor_name || "");
        setImageUrl(data.image_url || "");
        setHasRecord(true);
      } else {
        setSponsorName("");
        setImageUrl("");
        setHasRecord(false);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setMsg("⚠️ Image is too large. Please select an image under 10MB.");
      return;
    }

    setUploadingImage(true);
    setMsg("");

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `idol_${activeYear}_${Date.now()}.${fileExt}`;
      const filePath = `idols/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("donations")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("donations")
        .getPublicUrl(filePath);

      setImageUrl(publicUrlData.publicUrl);
      setMsg(`✅ ${activeYear} Idol image uploaded! Click Save to confirm.`);
    } catch (err) {
      setMsg(`❌ Image upload failed: ${err.message}`);
    } finally {
      setUploadingImage(false);
    }
  }

  function handleRemovePhoto() {
    setImageUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!imageUrl) {
      setMsg(`⚠️ Please upload the ${activeYear} Idol Image.`);
      return;
    }

    if (!sponsorName.trim()) {
      setMsg("⚠️ Please enter the Sponsor Devotee Name.");
      return;
    }

    setSaving(true);
    setMsg("");

    try {
      const { error } = await supabase
        .from("idol_details")
        .upsert(
          {
            year: Number(activeYear),
            sponsor_name: sponsorName.trim(),
            image_url: imageUrl.trim(),
          },
          { onConflict: "year" }
        );

      if (!error) {
        setMsg(`✅ ${activeYear} Idol Image & Sponsor Name saved successfully!`);
        fetchIdolDetails();
      } else {
        setMsg(`❌ Error saving: ${error.message}`);
      }
    } catch (err) {
      setMsg(`❌ Error: ${err.message}`);
    }
    setSaving(false);
  }

  async function handleDelete() {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the ${activeYear} Idol & Sponsor details? The festival page will show "Coming Soon".`
    );
    if (!confirmDelete) return;

    setDeleting(true);
    setMsg("");

    try {
      const { error } = await supabase
        .from("idol_details")
        .delete()
        .eq("year", Number(activeYear));

      if (!error) {
        setMsg(`🗑️ ${activeYear} Idol Sponsor details deleted successfully!`);
        setSponsorName("");
        setImageUrl("");
        setHasRecord(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        setMsg(`❌ Error deleting: ${error.message}`);
      }
    } catch (err) {
      setMsg(`❌ Error: ${err.message}`);
    }
    setDeleting(false);
  }

  return (
    <div className="admin-events-page">
      <AdminNavbar title={`Idol & Sponsor (${activeYear})`} />

      {msg && <div className="admin-msg-banner">{msg}</div>}

      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        <p style={{ color: "rgba(255,255,255,0.75)", marginBottom: "25px", fontSize: "0.95rem" }}>
          Provide the <strong>{activeYear} Ganesh Idol Image</strong> and the <strong>Sponsor Name</strong>, or delete existing records to display "Coming Soon".
        </p>

        {loading ? (
          <p>Loading details...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* 1. Idol Image Upload */}
            <div
              style={{
                background: "linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(25, 7, 2, 0.8))",
                border: "1.5px solid rgba(245, 158, 11, 0.4)",
                borderRadius: "20px",
                padding: "26px",
                marginBottom: "24px",
              }}
            >
              <span style={{ fontSize: "10px", fontWeight: "800", letterSpacing: "1.5px", color: "#f59e0b", display: "block", marginBottom: "4px" }}>
                STEP 1: IDOL IMAGE
              </span>
              <h3 style={{ margin: "0 0 16px 0", color: "#fff" }}>
                {activeYear} Ganesh Idol Photo *
              </h3>

              <div style={{ display: "flex", gap: "20px", alignItems: "center", flexWrap: "wrap" }}>
                {imageUrl && (
                  <div
                    style={{
                      position: "relative",
                      width: "160px",
                      height: "160px",
                      borderRadius: "14px",
                      overflow: "hidden",
                      border: "2px solid #f59e0b",
                      background: "#000",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src={imageUrl}
                      alt={`${activeYear} Idol Preview`}
                      style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                    />
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      style={{
                        position: "absolute",
                        top: "6px",
                        right: "6px",
                        background: "rgba(220, 38, 38, 0.9)",
                        color: "#fff",
                        border: "none",
                        borderRadius: "50%",
                        width: "24px",
                        height: "24px",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                      title="Remove image"
                    >
                      ×
                    </button>
                  </div>
                )}

                <div style={{ flex: 1, minWidth: "220px" }}>
                  <label style={{ display: "block", color: "#fde68a", fontSize: "0.85rem", fontWeight: "600", marginBottom: "8px" }}>
                    {imageUrl ? `Change ${activeYear} Idol Photo:` : `Upload ${activeYear} Idol Photo:`}
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    style={{
                      padding: "10px",
                      background: "rgba(0,0,0,0.4)",
                      border: "1px dashed rgba(245, 158, 11, 0.4)",
                      borderRadius: "12px",
                      color: "#fff",
                      width: "100%",
                      boxSizing: "border-box",
                      cursor: "pointer",
                    }}
                  />
                  {uploadingImage && (
                    <p style={{ color: "#f59e0b", fontSize: "0.85rem", marginTop: "6px" }}>
                      ⏳ Uploading photo...
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 2. Sponsor Name */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.04)",
                border: "1.5px solid rgba(245, 158, 11, 0.3)",
                borderRadius: "18px",
                padding: "26px",
                marginBottom: "24px",
              }}
            >
              <span style={{ fontSize: "10px", fontWeight: "800", letterSpacing: "1.5px", color: "#f59e0b", display: "block", marginBottom: "4px" }}>
                STEP 2: SPONSOR DETAILS
              </span>
              <h3 style={{ margin: "0 0 16px 0", color: "#fff" }}>
                {activeYear} Main Idol Sponsor Name (విగ్రహ దాత) *
              </h3>

              <div className="admin-form-group">
                <label>Sponsor Devotee / Family Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sri Monday Varaprasad & Family"
                  value={sponsorName}
                  onChange={(e) => setSponsorName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
              <button
                type="submit"
                className="admin-save-btn"
                style={{ flex: 2, padding: "14px", fontSize: "1rem" }}
                disabled={saving || uploadingImage || deleting}
              >
                {saving ? "Saving Details..." : `💾 Save ${activeYear} Idol & Sponsor`}
              </button>

              {hasRecord && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={saving || deleting}
                  style={{
                    flex: 1,
                    padding: "14px",
                    background: "rgba(239, 68, 68, 0.15)",
                    border: "1.5px solid #ef4444",
                    color: "#fca5a5",
                    borderRadius: "12px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    transition: "0.2s ease",
                  }}
                >
                  {deleting ? "Deleting..." : `🗑️ Delete / Reset (${activeYear})`}
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ManageIdol;