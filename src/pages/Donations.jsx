import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./Donations.css";

function Donations({ year }) {
  const [activeTab, setActiveTab] = useState("money");
  const [donations, setDonations] = useState([]);
  const [itemSponsors, setItemSponsors] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [yearId, setYearId] = useState(null);

  const [formData, setFormData] = useState({
    donor_name: "",
    mobile_number: "",
    amount: "",
    utr_number: "",
  });
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formMsg, setFormMsg] = useState("");
  const [copied, setCopied] = useState(false);

  const UPI_ID = "dsb@upi";

  useEffect(() => {
    if (year) fetchDonationData();
  }, [year]);

  async function fetchDonationData() {
    setLoading(true);

    const { data: yearData } = await supabase
      .from("festival_years")
      .select("id")
      .eq("year", Number(year))
      .maybeSingle();

    const targetYearId = yearData?.id;
    if (targetYearId) setYearId(targetYearId);

    // 1. Fetch Verified Cash Donations (supports both status types)
    let donQuery = supabase
      .from("donations")
      .select("*")
      .in("status", ["approved", "SUCCESS", "approved".toUpperCase()]);

    if (targetYearId) {
      donQuery = donQuery.or(`year.eq.${Number(year)},festival_year_id.eq.${targetYearId}`);
    } else {
      donQuery = donQuery.eq("year", Number(year));
    }

    const { data: donData } = await donQuery.order("created_at", { ascending: false });
    setDonations(donData || []);

    // 2. Fetch Item Sponsors (if table exists)
    try {
      let itemQuery = supabase.from("item_sponsors").select("*");
      if (targetYearId) {
        itemQuery = itemQuery.or(`year.eq.${Number(year)},festival_year_id.eq.${targetYearId}`);
      } else {
        itemQuery = itemQuery.eq("year", Number(year));
      }
      const { data: itemData } = await itemQuery;
      setItemSponsors(itemData || []);
    } catch {
      setItemSponsors([]);
    }

    // 3. Fetch Spendings / Expenses (checks 'spendings' then 'expenses')
    let expResult = await supabase
      .from("spendings")
      .select("*")
      .eq("year", Number(year));

    if (expResult.error || !expResult.data || expResult.data.length === 0) {
      const altExp = await supabase
        .from("expenses")
        .select("*")
        .eq("festival_year_id", targetYearId || 0);
      setExpenses(altExp.data || []);
    } else {
      setExpenses(expResult.data || []);
    }

    setLoading(false);
  }

  function handlePhoneChange(e) {
    const digitsOnly = e.target.value.replace(/\D/g, "");
    if (digitsOnly.length <= 10) {
      setFormData((prev) => ({ ...prev, mobile_number: digitsOnly }));
    }
  }

  async function handleSubmitDonation(e) {
    e.preventDefault();
    setFormMsg("");

    const phonePattern = /^[6-9]\d{9}$/;
    if (!phonePattern.test(formData.mobile_number)) {
      setFormMsg("⚠️ Please enter a valid 10-digit mobile number.");
      return;
    }

    setSubmitting(true);

    try {
      let screenshot_url = null;

      if (screenshotFile) {
        const fileExt = screenshotFile.name.split(".").pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `receipts/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("donations")
          .upload(filePath, screenshotFile);

        if (!uploadError) {
          const { data: publicUrlData } = supabase.storage
            .from("donations")
            .getPublicUrl(filePath);
          screenshot_url = publicUrlData.publicUrl;
        }
      }

      const { error: insertError } = await supabase.from("donations").insert([
        {
          year: Number(year),
          festival_year_id: yearId || null,
          donor_name: formData.donor_name.trim(),
          phone: formData.mobile_number.trim(),
          mobile_number: formData.mobile_number.trim(),
          amount: Number(formData.amount),
          utr_number: formData.utr_number.trim(),
          screenshot_url: screenshot_url,
          status: "pending",
        },
      ]);

      if (insertError) throw insertError;

      setFormMsg("🙏 Thank you! Your contribution has been submitted for admin verification.");
      setFormData({ donor_name: "", mobile_number: "", amount: "", utr_number: "" });
      setScreenshotFile(null);
      const fileInput = document.getElementById("screenshot-input");
      if (fileInput) fileInput.value = "";
    } catch (err) {
      setFormMsg("❌ " + (err.message || "Failed to submit donation."));
    } finally {
      setSubmitting(false);
    }
  }

  function handleCopyUpi() {
    navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  const totalDonations = donations.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalSpendings = expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const remainingBalance = totalDonations - totalSpendings;

  return (
    <div className="festival-section chanda-section-wrapper" id="chanda">
      <div className="section-heading">
        <span>✦ SUPPORT OUR CELEBRATION ✦</span>
        <h2>
          DSB <strong>CHANDA &amp; ACCOUNTS</strong>
        </h2>
        <p>
          Devotion, contributions, transparent expense records, and seva sponsorships for {year}.
        </p>
      </div>

      {/* QR & Contribution Submission Card */}
      <div className="donation-main-card">
        <div className="donation-qr-box">
          <span className="qr-badge">✦ SCAN &amp; PAY ✦</span>
          <div className="qr-image-wrapper">
            <img src="/images/chandaqr.png" alt="Chanda QR Code" className="qr-img" />
          </div>
          <div className="upi-id-badge" onClick={handleCopyUpi}>
            <span>UPI ID: <strong>{UPI_ID}</strong></span>
            <button className="copy-btn">{copied ? "Copied! ✓" : "Copy"}</button>
          </div>
          <p className="qr-note">Scan via PhonePe, Google Pay, or Paytm</p>
        </div>

        <div className="donation-form-box">
          <h3>Record Your Contribution</h3>
          <p>After completing your payment, enter your details and upload the receipt screenshot:</p>
          {formMsg && <div className="donation-msg-banner">{formMsg}</div>}

          <form onSubmit={handleSubmitDonation} className="donation-input-form">
            <div className="input-group">
              <label>Full Name *</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={formData.donor_name}
                onChange={(e) => setFormData({ ...formData, donor_name: e.target.value })}
                required
              />
            </div>

            <div className="input-row">
              <div className="input-group">
                <label>Mobile Number (10 Digits) *</label>
                <input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  pattern="[6-9][0-9]{9}"
                  minLength={10}
                  maxLength={10}
                  value={formData.mobile_number}
                  onChange={handlePhoneChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>Amount (₹) *</label>
                <input
                  type="number"
                  placeholder="e.g. 1000"
                  min="1"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label>Transaction / UTR Reference No. (Optional)</label>
              <input
                type="text"
                placeholder="e.g. 423985729103"
                value={formData.utr_number}
                onChange={(e) => setFormData({ ...formData, utr_number: e.target.value })}
              />
            </div>

            <div className="input-group">
              <label>Upload Payment Screenshot (Optional)</label>
              <input
                id="screenshot-input"
                type="file"
                accept="image/*"
                onChange={(e) => setScreenshotFile(e.target.files[0])}
                className="file-upload-input"
              />
            </div>

            <button type="submit" className="submit-donation-btn" disabled={submitting}>
              {submitting ? "Submitting Details..." : "Submit Chanda Details 🙏"}
            </button>
          </form>
        </div>
      </div>

      {/* 3-Column Financial Metrics Banner */}
      <div className="financial-summary-grid">
        <div className="fin-card fin-total-collected">
          <span className="fin-card-label">TOTAL CHANDA COLLECTED</span>
          <strong className="fin-val text-gold">₹{totalDonations.toLocaleString("en-IN")}</strong>
          <small>{donations.length} Verified Devotees</small>
        </div>

        <div className="fin-card fin-total-spent">
          <span className="fin-card-label">TOTAL SPENDINGS / EXPENSES</span>
          <strong className="fin-val text-red">₹{totalSpendings.toLocaleString("en-IN")}</strong>
          <small>{expenses.length} Expense Records</small>
        </div>

        <div className="fin-card fin-remaining-balance">
          <span className="fin-card-label">NET BALANCE (CHANDA - SPENDINGS)</span>
          <strong className={`fin-val ${remainingBalance >= 0 ? "text-green" : "text-negative"}`}>
            ₹{remainingBalance.toLocaleString("en-IN")}
          </strong>
          <small>{remainingBalance >= 0 ? "Surplus / Savings" : "Deficit"}</small>
        </div>
      </div>

      {/* Tab Selectors */}
      <div className="donor-tabs-container">
        <button
          className={`tab-btn ${activeTab === "money" ? "active" : ""}`}
          onClick={() => setActiveTab("money")}
        >
          💰 Cash Donors ({donations.length})
        </button>
        <button
          className={`tab-btn ${activeTab === "expenses" ? "active" : ""}`}
          onClick={() => setActiveTab("expenses")}
        >
          📉 Spendings &amp; Expenses ({expenses.length})
        </button>
        <button
          className={`tab-btn ${activeTab === "items" ? "active" : ""}`}
          onClick={() => setActiveTab("items")}
        >
          🎁 Item / Seva Sponsors ({itemSponsors.length})
        </button>
      </div>

      {/* Tab 1: Cash Donors */}
      {activeTab === "money" && (
        <div className="donations-table-wrapper">
          {loading ? (
            <div className="loading-box">Loading devotee contributions...</div>
          ) : donations.length === 0 ? (
            <div className="empty-box">
              <span>🙏</span>
              <h3>No Verified Donations Yet</h3>
              <p>Be the first to contribute towards {year} Mahotsav!</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="festive-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Devotee Name</th>
                    <th>Contact</th>
                    <th className="text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map((item, index) => {
                    const phoneVal = item.phone || item.mobile_number;
                    return (
                      <tr key={item.id || index}>
                        <td>{index + 1}</td>
                        <td><strong>{item.donor_name || item.name || item.devotee_name}</strong></td>
                        <td>{phoneVal ? String(phoneVal).slice(0, 4) + "******" : "—"}</td>
                        <td className="text-right amount-col">
                          ₹{Number(item.amount).toLocaleString("en-IN")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Spendings / Expenses */}
      {activeTab === "expenses" && (
        <div className="donations-table-wrapper">
          {loading ? (
            <div className="loading-box">Loading spendings...</div>
          ) : expenses.length === 0 ? (
            <div className="empty-box">
              <span>🧾</span>
              <h3>No Spendings Recorded Yet</h3>
              <p>Expense logs for {year} will be updated by the committee.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="festive-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Purpose / Expense Item</th>
                    <th>Category</th>
                    <th className="text-right">Amount Spent</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((item, index) => (
                    <tr key={item.id || index}>
                      <td>{index + 1}</td>
                      <td>
                        <strong className="expense-title-col">
                          {item.item_name || item.title}
                        </strong>
                      </td>
                      <td>
                        <span className="expense-category-pill">
                          {item.category || "General"}
                        </span>
                      </td>
                      <td className="text-right amount-spent-col">
                        ₹{Number(item.amount).toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="tfoot-summary-row">
                    <td colSpan="3" className="text-right">
                      <strong>TOTAL FESTIVAL SPENDINGS:</strong>
                    </td>
                    <td className="text-right amount-spent-col">
                      <strong>₹{totalSpendings.toLocaleString("en-IN")}</strong>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Item Sponsors */}
      {activeTab === "items" && (
        <div className="donations-table-wrapper">
          {loading ? (
            <div className="loading-box">Loading item sponsors...</div>
          ) : itemSponsors.length === 0 ? (
            <div className="empty-box">
              <span>🎁</span>
              <h3>No Item Sponsors Yet</h3>
              <p>Special item and seva sponsorships for {year} will be listed here.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="festive-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Sponsored Item / Seva</th>
                    <th>Sponsor Name</th>
                  </tr>
                </thead>
                <tbody>
                  {itemSponsors.map((item, index) => (
                    <tr key={item.id || index}>
                      <td>{index + 1}</td>
                      <td>
                        <strong className="item-name-highlight">
                          🎁 {item.item_name}
                        </strong>
                      </td>
                      <td>
                        <span className="sponsor-name">{item.sponsor_name}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Donations;