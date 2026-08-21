import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { useAdminYear } from "./AdminYearContext";
import AdminNavbar from "./AdminNavbar";
import "./ManageDonations.css";

function ManageDonations() {
  const { activeYear } = useAdminYear();
  const [tab, setTab] = useState("approved");
  const [loading, setLoading] = useState(true);

  const [donations, setDonations] = useState([]);
  const [spendings, setSpendings] = useState([]);
  const [itemSponsors, setItemSponsors] = useState([]);
  const [previewReceipt, setPreviewReceipt] = useState(null);

  // Manual Donor State
  const [showAddDonor, setShowAddDonor] = useState(false);
  const [newDonor, setNewDonor] = useState({
    donor_name: "",
    amount: "",
    mobile_number: "",
    utr_number: "Cash / Manual",
    gothram: "",
    status: "SUCCESS",
  });

  // Item Sponsor Form State
  const [itemForm, setItemForm] = useState({
    item_name: "",
    sponsor_name: "",
    contact: "",
  });

  // Spending Form State
  const [spendItem, setSpendItem] = useState("");
  const [spendAmount, setSpendAmount] = useState("");
  const [spendCategory, setSpendCategory] = useState("General");
  const [editingSpendId, setEditingSpendId] = useState(null);

  // Donation Edit Modal State
  const [editingDonation, setEditingDonation] = useState(null);
  const [editDonForm, setEditDonForm] = useState({
    donor_name: "",
    amount: "",
    mobile_number: "",
    utr_number: "",
    gothram: "",
    status: "SUCCESS",
  });

  const ITEM_CATEGORIES = [
    "General",
    "Prasadam & Annadanam",
    "Lighting & Stage Decoration",
    "Sound System & DJ",
    "Pooja & Vedic Rituals",
    "Ganesh Idol & Transport",
    "Visarjan & Dappu",
    "Miscellaneous",
  ];

  useEffect(() => {
    fetchAll();
  }, [activeYear]);

  async function fetchAll() {
    setLoading(true);
    const yr = Number(activeYear) || 2026;

    const [dRes, sRes, iRes] = await Promise.all([
      supabase.from("donations").select("*").eq("year", yr).order("created_at", { ascending: false }),
      supabase.from("spendings").select("*").eq("year", yr).order("created_at", { ascending: false }),
      supabase.from("item_sponsors").select("*").eq("year", yr).order("created_at", { ascending: true }),
    ]);

    setDonations(dRes.data || []);
    setSpendings(sRes.data || []);
    setItemSponsors(iRes.data || []);
    setLoading(false);
  }

  // ================= EXPORT / DOWNLOAD FUNCTIONS ================= //
  function downloadCSV(csvContent, fileName) {
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function exportDonorsCSV() {
    const approved = donations.filter((d) => isApproved(d.status));
    if (approved.length === 0) return alert("No approved donors to export!");

    let csv = "S.No,Devotee Name,Amount (INR),Mobile Number,Gotram,Payment Ref / UTR,Date\n";
    approved.forEach((d, i) => {
      const name = `"${(d.donor_name || d.name || "").replace(/"/g, '""')}"`;
      const amount = d.amount || 0;
      const phone = `"${(d.mobile_number || d.phone || "").replace(/"/g, '""')}"`;
      const gotram = `"${(d.gothram || "").replace(/"/g, '""')}"`;
      const utr = `"${(d.utr_number || d.txn_id || "Cash").replace(/"/g, '""')}"`;
      const date = d.created_at ? new Date(d.created_at).toLocaleDateString("en-IN") : "N/A";
      csv += `${i + 1},${name},${amount},${phone},${gotram},${utr},${date}\n`;
    });

    downloadCSV(csv, `DSB_Donations_${activeYear}.csv`);
  }

  function exportSpendingsCSV() {
    if (spendings.length === 0) return alert("No spendings to export!");

    let csv = "S.No,Expense Item,Category,Amount (INR),Date\n";
    spendings.forEach((s, i) => {
      const item = `"${(s.item_name || s.title || "").replace(/"/g, '""')}"`;
      const cat = `"${(s.category || "General").replace(/"/g, '""')}"`;
      const amt = s.amount || 0;
      const date = s.created_at ? new Date(s.created_at).toLocaleDateString("en-IN") : "N/A";
      csv += `${i + 1},${item},${cat},${amt},${date}\n`;
    });

    downloadCSV(csv, `DSB_Spendings_${activeYear}.csv`);
  }

  function exportItemSponsorsCSV() {
    if (itemSponsors.length === 0) return alert("No item sponsors to export!");

    let csv = "S.No,Item / Seva Name,Sponsor Devotee Name,Contact Number,Date\n";
    itemSponsors.forEach((it, i) => {
      const item = `"${(it.item_name || "").replace(/"/g, '""')}"`;
      const sponsor = `"${(it.sponsor_name || "").replace(/"/g, '""')}"`;
      const contact = `"${(it.contact || "").replace(/"/g, '""')}"`;
      const date = it.created_at ? new Date(it.created_at).toLocaleDateString("en-IN") : "N/A";
      csv += `${i + 1},${item},${sponsor},${contact},${date}\n`;
    });

    downloadCSV(csv, `DSB_Item_Sponsors_${activeYear}.csv`);
  }

  function exportFullAuditCSV() {
    const approved = donations.filter((d) => isApproved(d.status));
    const totalDonations = approved.reduce((sum, d) => sum + Number(d.amount || 0), 0);
    const totalSpent = spendings.reduce((sum, s) => sum + Number(s.amount || 0), 0);
    const balance = totalDonations - totalSpent;

    let csv = `DSB VINAYAKA MAHOTSAV - ${activeYear} COMPLETE FINANCIAL STATEMENT\n\n`;
    csv += `TOTAL CHANDA COLLECTED,INR ${totalDonations}\n`;
    csv += `TOTAL SPENDINGS,INR ${totalSpent}\n`;
    csv += `NET BALANCE (SAVINGS / SURPLUS),INR ${balance}\n\n`;

    csv += `--- APPROVED DONORS LIST ---\n`;
    csv += `S.No,Devotee Name,Amount (INR),Contact,Payment Ref\n`;
    approved.forEach((d, i) => {
      csv += `${i + 1},"${(d.donor_name || d.name || '').replace(/"/g, '""')}",${d.amount},"${d.mobile_number || ''}","${d.utr_number || 'Cash'}"\n`;
    });

    csv += `\n--- ITEMIZED SPENDINGS LIST ---\n`;
    csv += `S.No,Expense Item,Category,Amount (INR)\n`;
    spendings.forEach((s, i) => {
      csv += `${i + 1},"${(s.item_name || s.title || '').replace(/"/g, '""')}","${s.category || 'General'}",${s.amount}\n`;
    });

    csv += `\n--- ITEM & SEVA SPONSORS LIST ---\n`;
    csv += `S.No,Item / Seva Name,Sponsor Name,Contact\n`;
    itemSponsors.forEach((it, i) => {
      csv += `${i + 1},"${(it.item_name || '').replace(/"/g, '""')}","${(it.sponsor_name || '').replace(/"/g, '""')}","${it.contact || ''}"\n`;
    });

    downloadCSV(csv, `DSB_${activeYear}_Full_Accounts_Statement.csv`);
  }

  // ================= CRUD HANDLERS ================= //
  async function handleAddDonor(e) {
    e.preventDefault();
    if (!newDonor.donor_name.trim() || !newDonor.amount) {
      alert("⚠️ Please enter Devotee Name and Amount.");
      return;
    }

    const yr = Number(activeYear) || 2026;

    const payload = {
      year: yr,
      donor_name: newDonor.donor_name.trim(),
      name: newDonor.donor_name.trim(),
      amount: Number(newDonor.amount),
      mobile_number: newDonor.mobile_number ? newDonor.mobile_number.trim() : "",
      utr_number: newDonor.utr_number ? newDonor.utr_number.trim() : "Cash / Manual",
      gothram: newDonor.gothram ? newDonor.gothram.trim() : "",
      status: newDonor.status || "SUCCESS",
    };

    const { error } = await supabase.from("donations").insert([payload]);

    if (error) {
      console.error("Donation insert error:", error);
      alert(`❌ Failed to add donor: ${error.message}`);
    } else {
      alert("✅ Donor added successfully!");
      setNewDonor({ donor_name: "", amount: "", mobile_number: "", utr_number: "Cash / Manual", gothram: "", status: "SUCCESS" });
      setShowAddDonor(false);
      fetchAll();
    }
  }

  function handleStartEditDonation(d) {
    setEditingDonation(d);
    setEditDonForm({
      donor_name: d.donor_name || d.name || "",
      amount: d.amount || "",
      mobile_number: d.mobile_number || d.phone || "",
      utr_number: d.utr_number || d.txn_id || "",
      gothram: d.gothram || "",
      status: d.status || "SUCCESS",
    });
  }

  async function handleSaveDonationEdit(e) {
    e.preventDefault();
    if (!editingDonation) return;

    const updateData = {
      donor_name: editDonForm.donor_name.trim(),
      name: editDonForm.donor_name.trim(),
      amount: Number(editDonForm.amount),
      mobile_number: editDonForm.mobile_number.trim(),
      utr_number: editDonForm.utr_number.trim(),
      gothram: editDonForm.gothram.trim(),
      status: editDonForm.status,
    };

    const { error } = await supabase
      .from("donations")
      .update(updateData)
      .eq("id", Number(editingDonation.id));

    if (error) {
      alert(`❌ Update error: ${error.message}`);
    } else {
      setEditingDonation(null);
      fetchAll();
    }
  }

  async function handleAddItemSponsor(e) {
    e.preventDefault();
    if (!itemForm.item_name.trim() || !itemForm.sponsor_name.trim()) {
      alert("⚠️ Please enter both Item Name and Sponsor Name.");
      return;
    }

    const yr = Number(activeYear) || 2026;

    const payload = {
      year: yr,
      item_name: itemForm.item_name.trim(),
      sponsor_name: itemForm.sponsor_name.trim(),
      contact: itemForm.contact ? itemForm.contact.trim() : "",
    };

    const { error } = await supabase.from("item_sponsors").insert([payload]);

    if (error) {
      console.error("Item sponsor insert error:", error);
      alert(`❌ Failed to add item sponsor: ${error.message}`);
    } else {
      alert("✅ Item Sponsor added successfully!");
      setItemForm({ item_name: "", sponsor_name: "", contact: "" });
      fetchAll();
    }
  }

  async function handleDeleteItemSponsor(id) {
    if (!window.confirm("Delete this item sponsor entry?")) return;
    const { error } = await supabase.from("item_sponsors").delete().eq("id", Number(id));
    if (error) {
      alert(`❌ Error deleting: ${error.message}`);
    } else {
      fetchAll();
    }
  }

  async function handleAddSpending(e) {
    e.preventDefault();
    if (!spendItem.trim() || !spendAmount) return;

    const yr = Number(activeYear) || 2026;

    if (editingSpendId) {
      await supabase
        .from("spendings")
        .update({
          item_name: spendItem.trim(),
          title: spendItem.trim(),
          amount: Number(spendAmount),
          category: spendCategory.trim(),
        })
        .eq("id", Number(editingSpendId));
      setEditingSpendId(null);
    } else {
      await supabase.from("spendings").insert([
        {
          year: yr,
          item_name: spendItem.trim(),
          title: spendItem.trim(),
          amount: Number(spendAmount),
          category: spendCategory.trim(),
        },
      ]);
    }

    setSpendItem("");
    setSpendAmount("");
    setSpendCategory("General");
    fetchAll();
  }

  function handleStartEditSpending(s) {
    setEditingSpendId(s.id);
    setSpendItem(s.item_name || s.title || "");
    setSpendAmount(s.amount || "");
    setSpendCategory(s.category || "General");
  }

  function handleCancelEditSpending() {
    setEditingSpendId(null);
    setSpendItem("");
    setSpendAmount("");
    setSpendCategory("General");
  }

  async function handleDeleteSpending(id) {
    if (!window.confirm("Delete this spending entry?")) return;
    const numId = Number(id);
    let { error } = await supabase.from("spendings").delete().eq("id", numId);
    if (error) {
      await supabase.from("expenses").delete().eq("id", numId);
    }
    if (editingSpendId === numId) handleCancelEditSpending();
    fetchAll();
  }

  async function handleApprove(id) {
    const { error } = await supabase.from("donations").update({ status: "SUCCESS" }).eq("id", Number(id));
    if (error) {
      alert(`Error approving: ${error.message}`);
    } else {
      fetchAll();
    }
  }

  async function handleDeleteDonation(id) {
    if (!window.confirm("Delete this donation record?")) return;
    const { error } = await supabase.from("donations").delete().eq("id", Number(id));
    if (error) {
      alert(`Error deleting: ${error.message}`);
    } else {
      fetchAll();
    }
  }

  const isApproved = (s) => s === "approved" || s === "SUCCESS" || s === "verified";
  const approvedDonations = donations.filter((d) => isApproved(d.status));
  const pendingDonations = donations.filter((d) => !isApproved(d.status));

  const totalApprovedChanda = approvedDonations.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
  const totalSpent = spendings.reduce((sum, s) => sum + (Number(s.amount) || 0), 0);
  const netBalance = totalApprovedChanda - totalSpent;

  return (
    <div className="admin-donations-page">
      <AdminNavbar title={`Accounts & Donations Management (${activeYear})`} />

      {/* Summary Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
          marginBottom: "20px",
        }}
      >
        <div style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.4)", borderRadius: "12px", padding: "16px" }}>
          <span style={{ fontSize: "11px", fontWeight: "800", color: "#6ee7b7" }}>TOTAL CHANDA ({activeYear})</span>
          <h2 style={{ margin: "6px 0 0 0", color: "#10b981" }}>₹{totalApprovedChanda.toLocaleString("en-IN")}</h2>
        </div>
        <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.4)", borderRadius: "12px", padding: "16px" }}>
          <span style={{ fontSize: "11px", fontWeight: "800", color: "#fca5a5" }}>TOTAL SPENT ({activeYear})</span>
          <h2 style={{ margin: "6px 0 0 0", color: "#ef4444" }}>₹{totalSpent.toLocaleString("en-IN")}</h2>
        </div>
        <div style={{ background: "rgba(245, 158, 11, 0.1)", border: "1px solid rgba(245, 158, 11, 0.4)", borderRadius: "12px", padding: "16px" }}>
          <span style={{ fontSize: "11px", fontWeight: "800", color: "#fde68a" }}>NET BALANCE</span>
          <h2 style={{ margin: "6px 0 0 0", color: "#f59e0b" }}>₹{netBalance.toLocaleString("en-IN")}</h2>
        </div>
      </div>

      {/* Top Global Audit Download Button */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "15px" }}>
        <button
          onClick={exportFullAuditCSV}
          style={{
            background: "rgba(16, 185, 129, 0.15)",
            border: "1px solid #10b981",
            color: "#6ee7b7",
            padding: "8px 16px",
            borderRadius: "10px",
            fontWeight: "700",
            cursor: "pointer",
            fontSize: "0.85rem",
          }}
        >
          📊 Export Full {activeYear} Statement (CSV)
        </button>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", marginBottom: "16px" }}>
        <div className="admin-tabs" style={{ margin: 0 }}>
          <button className={`admin-tab-btn ${tab === "approved" ? "active" : ""}`} onClick={() => setTab("approved")}>
            💰 Approved Donors ({approvedDonations.length})
          </button>
          <button className={`admin-tab-btn warning-tab ${tab === "pending" ? "active" : ""}`} onClick={() => setTab("pending")}>
            ⏳ Pending ({pendingDonations.length})
          </button>
          <button className={`admin-tab-btn ${tab === "spendings" ? "active" : ""}`} onClick={() => setTab("spendings")}>
            📉 Spendings ({spendings.length})
          </button>
          <button className={`admin-tab-btn ${tab === "items" ? "active" : ""}`} onClick={() => setTab("items")}>
            🎁 Item Sponsors ({itemSponsors.length})
          </button>
        </div>

        {tab === "approved" && (
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={exportDonorsCSV}
              style={{
                background: "rgba(245, 158, 11, 0.15)",
                border: "1px solid rgba(245, 158, 11, 0.4)",
                color: "#fde68a",
                padding: "8px 14px",
                borderRadius: "10px",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "0.85rem",
              }}
            >
              📥 Download Donors CSV
            </button>
            <button
              onClick={() => setShowAddDonor(!showAddDonor)}
              style={{
                background: showAddDonor ? "rgba(239, 68, 68, 0.2)" : "linear-gradient(135deg, #f59e0b, #d97706)",
                color: showAddDonor ? "#fca5a5" : "#150501",
                border: showAddDonor ? "1px solid #ef4444" : "none",
                borderRadius: "10px",
                padding: "8px 16px",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "0.85rem",
              }}
            >
              {showAddDonor ? "✕ Cancel" : "➕ Add Manual Donor"}
            </button>
          </div>
        )}

        {tab === "spendings" && (
          <button
            onClick={exportSpendingsCSV}
            style={{
              background: "rgba(239, 68, 68, 0.15)",
              border: "1px solid rgba(239, 68, 68, 0.4)",
              color: "#fca5a5",
              padding: "8px 14px",
              borderRadius: "10px",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "0.85rem",
            }}
          >
            📥 Download Spendings CSV
          </button>
        )}

        {tab === "items" && (
          <button
            onClick={exportItemSponsorsCSV}
            style={{
              background: "rgba(245, 158, 11, 0.15)",
              border: "1px solid rgba(245, 158, 11, 0.4)",
              color: "#fde68a",
              padding: "8px 14px",
              borderRadius: "10px",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "0.85rem",
            }}
          >
            📥 Download Sponsors CSV
          </button>
        )}
      </div>

      {/* MANUAL DONOR ENTRY FORM */}
      {showAddDonor && tab === "approved" && (
        <form onSubmit={handleAddDonor} style={{ background: "rgba(245,158,11,0.1)", border: "1px solid #f59e0b", padding: "20px", borderRadius: "14px", marginBottom: "20px" }}>
          <h4>➕ Add Cash / Manual Devotee Donor</h4>
          <div className="form-row">
            <div className="form-group">
              <label>Devotee Name *</label>
              <input type="text" required value={newDonor.donor_name} onChange={(e) => setNewDonor({ ...newDonor, donor_name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Amount (₹) *</label>
              <input type="number" required value={newDonor.amount} onChange={(e) => setNewDonor({ ...newDonor, amount: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Mobile Number</label>
              <input type="tel" value={newDonor.mobile_number} onChange={(e) => setNewDonor({ ...newDonor, mobile_number: e.target.value })} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Payment Ref / UTR / Cash</label>
              <input type="text" value={newDonor.utr_number} onChange={(e) => setNewDonor({ ...newDonor, utr_number: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Gothram / Family Notes</label>
              <input type="text" value={newDonor.gothram} onChange={(e) => setNewDonor({ ...newDonor, gothram: e.target.value })} />
            </div>
          </div>
          <button type="submit" className="admin-save-btn">Record &amp; Approve Donor</button>
        </form>
      )}

      {/* TAB 1: APPROVED DONORS */}
      {tab === "approved" && (
        <div className="admin-full-panel">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Devotee Name</th>
                <th>Contact / Gotram</th>
                <th>UTR / Payment Ref</th>
                <th>Amount</th>
                <th>Receipt</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {approvedDonations.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: "center", padding: "20px" }}>No approved donations recorded for {activeYear}.</td></tr>
              ) : (
                approvedDonations.map((d, i) => {
                  const receiptUrl = d.screenshot_url || d.receipt_url || d.image_url;
                  return (
                    <tr key={d.id}>
                      <td>{i + 1}</td>
                      <td><strong>{d.donor_name || d.name}</strong></td>
                      <td>{d.mobile_number || d.phone || ""}{d.gothram ? ` (${d.gothram})` : ""}</td>
                      <td><span className="utr-code">{d.utr_number || d.txn_id || "Cash"}</span></td>
                      <td style={{ color: "#10b981", fontWeight: "bold" }}>₹{Number(d.amount).toLocaleString("en-IN")}</td>
                      <td>
                        {receiptUrl ? (
                          <button
                            type="button"
                            onClick={() => setPreviewReceipt(receiptUrl)}
                            className="view-receipt-btn"
                          >
                            👁️ View
                          </button>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button onClick={() => handleStartEditDonation(d)} className="action-approve" style={{ background: "rgba(59, 130, 246, 0.2)", color: "#60a5fa", borderColor: "#3b82f6" }}>Edit</button>
                          <button onClick={() => handleDeleteDonation(d.id)} className="action-del">Delete</button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 2: PENDING APPROVALS */}
      {tab === "pending" && (
        <div className="admin-full-panel">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>Devotee Name</th>
                <th>Amount</th>
                <th>Contact</th>
                <th>UTR / Txn ID</th>
                <th>Receipt Screenshot</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingDonations.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: "center", padding: "20px" }}>No pending donations for {activeYear}.</td></tr>
              ) : (
                pendingDonations.map((d) => {
                  const receiptUrl = d.screenshot_url || d.receipt_url || d.image_url;
                  return (
                    <tr key={d.id}>
                      <td><strong>{d.donor_name || d.name}</strong></td>
                      <td style={{ color: "#f59e0b", fontWeight: "bold" }}>₹{Number(d.amount).toLocaleString("en-IN")}</td>
                      <td>{d.mobile_number || d.phone || "—"}</td>
                      <td><span className="utr-code">{d.utr_number || d.txn_id || "N/A"}</span></td>
                      <td>
                        {receiptUrl ? (
                          <button
                            type="button"
                            onClick={() => setPreviewReceipt(receiptUrl)}
                            className="view-receipt-btn"
                            style={{
                              background: "rgba(245, 158, 11, 0.2)",
                              border: "1px solid #f59e0b",
                              color: "#fde68a",
                              padding: "4px 10px",
                              borderRadius: "6px",
                              cursor: "pointer",
                              fontWeight: "bold",
                            }}
                          >
                            👁️ View Proof
                          </button>
                        ) : (
                          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.85rem" }}>No image</span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button onClick={() => handleApprove(d.id)} className="action-approve">Approve</button>
                          <button onClick={() => handleStartEditDonation(d)} className="action-approve" style={{ background: "rgba(59, 130, 246, 0.2)", color: "#60a5fa", borderColor: "#3b82f6" }}>Edit</button>
                          <button onClick={() => handleDeleteDonation(d.id)} className="action-del">Reject</button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: SPENDINGS */}
      {tab === "spendings" && (
        <div className="admin-grid-layout">
          <div className="admin-form-panel">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3>{editingSpendId ? "✏️ Edit Spending" : `➕ Add Expense Item (${activeYear})`}</h3>
              {editingSpendId && (
                <button type="button" onClick={handleCancelEditSpending} style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", fontSize: "0.85rem" }}>Cancel</button>
              )}
            </div>
            <form onSubmit={handleAddSpending}>
              <div className="form-group">
                <label>Expense Title *</label>
                <input type="text" required value={spendItem} onChange={(e) => setSpendItem(e.target.value)} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Amount (₹) *</label>
                  <input type="number" required value={spendAmount} onChange={(e) => setSpendAmount(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select value={spendCategory} onChange={(e) => setSpendCategory(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(245, 158, 11, 0.3)", color: "#fff" }}>
                    {ITEM_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat} style={{ background: "#1c0b02" }}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button type="submit" className="admin-save-btn">{editingSpendId ? "Update Spending" : "Add Spending"}</button>
            </form>
          </div>
          <div className="admin-list-panel">
            <h3>Itemized Expenses</h3>
            <table className="admin-data-table">
              <thead><tr><th>Item</th><th>Category</th><th>Amount</th><th>Actions</th></tr></thead>
              <tbody>
                {spendings.map((s) => (
                  <tr key={s.id}>
                    <td><strong>{s.item_name || s.title}</strong></td>
                    <td>{s.category}</td>
                    <td style={{ color: "#ef4444", fontWeight: "bold" }}>₹{s.amount}</td>
                    <td>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button onClick={() => handleStartEditSpending(s)} className="action-approve" style={{ background: "rgba(59, 130, 246, 0.2)", color: "#60a5fa", borderColor: "#3b82f6" }}>Edit</button>
                        <button onClick={() => handleDeleteSpending(s.id)} className="action-del">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: ITEM / SEVA SPONSORS */}
      {tab === "items" && (
        <div className="admin-grid-layout">
          <div className="admin-form-panel">
            <h3>➕ Add Item / Seva Sponsor</h3>
            <form onSubmit={handleAddItemSponsor}>
              <div className="form-group">
                <label>Item / Seva Name *</label>
                <input type="text" placeholder="e.g. 1st Day Annadanam, Laddu, Sound System" required value={itemForm.item_name} onChange={(e) => setItemForm({ ...itemForm, item_name: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Sponsor Devotee Name *</label>
                <input type="text" placeholder="e.g. Sri Ramesh & Family" required value={itemForm.sponsor_name} onChange={(e) => setItemForm({ ...itemForm, sponsor_name: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Contact Number (Optional)</label>
                <input type="tel" placeholder="e.g. 9876543210" value={itemForm.contact} onChange={(e) => setItemForm({ ...itemForm, contact: e.target.value })} />
              </div>
              <button type="submit" className="admin-save-btn">Save Item Sponsor</button>
            </form>
          </div>

          <div className="admin-list-panel">
            <h3>🎁 {activeYear} Item / Seva Sponsors List</h3>
            <table className="admin-data-table">
              <thead>
                <tr><th>#</th><th>Item / Seva Name</th><th>Sponsor Name</th><th>Contact</th><th>Action</th></tr>
              </thead>
              <tbody>
                {itemSponsors.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: "center", padding: "16px" }}>No item sponsors added yet.</td></tr>
                ) : (
                  itemSponsors.map((it, idx) => (
                    <tr key={it.id}>
                      <td>{idx + 1}</td>
                      <td><strong>{it.item_name}</strong></td>
                      <td>{it.sponsor_name}</td>
                      <td>{it.contact || "—"}</td>
                      <td><button onClick={() => handleDeleteItemSponsor(it.id)} className="action-del">Delete</button></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DONATION EDIT MODAL */}
      {editingDonation && (
        <div className="modal-overlay" onClick={() => setEditingDonation(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setEditingDonation(null)}>×</button>
            <h3>✏️ Edit Donation Record</h3>
            <form onSubmit={handleSaveDonationEdit} style={{ marginTop: "16px" }}>
              <div className="form-group">
                <label>Donor Name *</label>
                <input type="text" value={editDonForm.donor_name} onChange={(e) => setEditDonForm({ ...editDonForm, donor_name: e.target.value })} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Amount (₹) *</label>
                  <input type="number" value={editDonForm.amount} onChange={(e) => setEditDonForm({ ...editDonForm, amount: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Mobile Number</label>
                  <input type="text" value={editDonForm.mobile_number} onChange={(e) => setEditDonForm({ ...editDonForm, mobile_number: e.target.value })} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>UTR / Transaction ID</label>
                  <input type="text" value={editDonForm.utr_number} onChange={(e) => setEditDonForm({ ...editDonForm, utr_number: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select value={editDonForm.status} onChange={(e) => setEditDonForm({ ...editDonForm, status: e.target.value })} style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(245, 158, 11, 0.3)", color: "#fff" }}>
                    <option value="SUCCESS">Approved (SUCCESS)</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="admin-save-btn" style={{ width: "100%", marginTop: "12px" }}>Save Changes</button>
            </form>
          </div>
        </div>
      )}

      {/* FULLSCREEN PAYMENT RECEIPT MODAL */}
      {previewReceipt && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.88)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 99999,
            padding: "20px",
          }}
          onClick={() => setPreviewReceipt(null)}
        >
          <div
            className="modal-content"
            style={{
              position: "relative",
              maxWidth: "90vw",
              maxHeight: "90vh",
              background: "#1a0802",
              border: "1.5px solid #f59e0b",
              borderRadius: "18px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close-btn"
              style={{
                position: "absolute",
                top: "10px",
                right: "14px",
                background: "rgba(239, 68, 68, 0.8)",
                color: "#fff",
                border: "none",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                fontSize: "18px",
                cursor: "pointer",
              }}
              onClick={() => setPreviewReceipt(null)}
            >
              ×
            </button>
            <h3 style={{ margin: "0 0 14px 0", color: "#fde68a", fontSize: "1.2rem" }}>
              💳 Payment Screenshot Proof
            </h3>
            <div style={{ maxWidth: "100%", maxHeight: "75vh", overflow: "auto" }}>
              <img
                src={previewReceipt}
                alt="Payment Receipt"
                style={{
                  maxWidth: "100%",
                  maxHeight: "70vh",
                  objectFit: "contain",
                  borderRadius: "10px",
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageDonations;