import { useEffect, useState } from "react";
import axios from "axios";
import {
  Users, ClipboardList, Share2, MessageSquareText,
  BarChart3, CheckCircle2, RotateCcw, Save, ChevronDown,
  User, AlertCircle, Clock, ThumbsUp,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
const API_URL = import.meta.env.VITE_API_URL;
const navItems = [
  { label: "Dashboard", icon: BarChart3, path: "/manager-dashboard" },
  { label: "Team Members", icon: Users, path: "/manager/team" },
  { label: "Goal Approvals", icon: ClipboardList, path: "/manager/approvals" },
  { label: "Shared Goals", icon: Share2, path: "/manager/shared-goals" },
  { label: "Quarterly Check-ins", icon: MessageSquareText, path: "/manager/checkins" },
  { label: "Team Analytics", icon: BarChart3, path: "/manager/analytics" },
];

const STATUS_STYLE = {
  submitted:    { color: "#f59e0b", bg: "#fef3c7", label: "Submitted" },
  approved:     { color: "#10b981", bg: "#d1fae5", label: "Approved" },
  rework:       { color: "#ef4444", bg: "#fee2e2", label: "Returned for Rework" },
  draft:        { color: "#9aaac8", bg: "#f4f7ff", label: "Draft" },
};

function ManagerApprovals() {
  const [sheets, setSheets] = useState([]);
  const [reworkModal, setReworkModal] = useState(null); // sheetId
  const [reworkComment, setReworkComment] = useState("");
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchSheets = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/goals/submitted`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSheets(res.data);
    } catch {
      alert("Failed to fetch goal sheets");
    }
  };

  useEffect(() => { fetchSheets(); }, []);

  const approveSheet = async (sheetId) => {
    try {
      const res = await axios.put(
        `${API_URL}/api/goals/manager/approve/${sheetId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.message);
      fetchSheets();
    } catch (err) {
      alert(err.response?.data?.message || "Approval failed");
    }
  };

  const returnRework = async () => {
    if (!reworkComment.trim()) return alert("Please enter a rework comment");
    try {
      const res = await axios.put(
        `${API_URL}/api/goals/manager/rework/${reworkModal}`,
        { comment: reworkComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.message);
      setReworkModal(null);
      setReworkComment("");
      fetchSheets();
    } catch {
      alert("Failed to return for rework");
    }
  };

  const pending = sheets.filter((s) => s.status === "submitted").length;

  return (
    <div style={S.layout}>
      <Sidebar navItems={navItems} role="manager" />

      <main style={S.main}>
        {/* Topbar */}
        <div style={S.topbar}>
          <div>
            <h1 style={S.pageTitle}>Goal Approvals</h1>
            <p style={S.pageSubtitle}>Review, edit and approve employee goal sheets</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {pending > 0 && (
              <div style={S.pendingBadge}>
                <AlertCircle size={14} />
                {pending} pending review
              </div>
            )}
            <div style={{ ...S.avatar, background: "#0ea5e9" }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={S.statsRow}>
          {[
            { label: "Total Sheets", value: sheets.length, color: "#0ea5e9" },
            { label: "Pending", value: sheets.filter(s => s.status === "submitted").length, color: "#f59e0b" },
            { label: "Approved", value: sheets.filter(s => s.status === "approved").length, color: "#10b981" },
            { label: "Rework", value: sheets.filter(s => s.status === "rework").length, color: "#ef4444" },
          ].map((s) => (
            <div key={s.label} style={S.statCard}>
              <div style={{ ...S.statValue, color: s.color }}>{s.value}</div>
              <div style={S.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Empty */}
        {sheets.length === 0 && (
          <div style={S.emptyState}>
            <ClipboardList size={40} color="#c7d2fe" />
            <p style={{ color: "#6b7a99", marginTop: "12px" }}>No submitted goal sheets yet.</p>
          </div>
        )}

        {/* Sheets */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {sheets.map((sheet) => {
            const statusStyle = STATUS_STYLE[sheet.status] || STATUS_STYLE.draft;
            return (
              <div key={sheet.id} style={S.sheetCard}>
                {/* Sheet header */}
                <div style={S.sheetHeader}>
                  <div style={S.employeeRow}>
                    <div style={S.empAvatar}>
                      {sheet.employee?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={S.empName}>{sheet.employee?.name}</div>
                      <div style={S.empSub}>{sheet.employee?.email}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ ...S.statusPill, background: statusStyle.bg, color: statusStyle.color }}>
                      {statusStyle.label}
                    </div>
                    <div style={S.goalCount}>{sheet.Goals?.length} goals</div>
                  </div>
                </div>

                {/* Goal rows */}
                <div style={{ padding: "0 20px 4px" }}>
                  {sheet.Goals?.map((goal) => (
                    <GoalEditCard key={goal.id} goal={goal} token={token} onSaved={fetchSheets} />
                  ))}
                </div>

                {/* Action footer */}
                {sheet.status === "submitted" && (
                  <div style={S.sheetFooter}>
                    <button
                      onClick={() => { setReworkModal(sheet.id); setReworkComment(""); }}
                      style={S.reworkBtn}
                    >
                      <RotateCcw size={15} /> Return for Rework
                    </button>
                    <button onClick={() => approveSheet(sheet.id)} style={S.approveBtn}>
                      <CheckCircle2 size={15} /> Approve Sheet
                    </button>
                  </div>
                )}
                {sheet.status === "approved" && (
                  <div style={S.approvedBanner}>
                    <ThumbsUp size={15} /> Sheet approved
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      {/* Rework Modal */}
      {reworkModal && (
        <div style={S.modalOverlay}>
          <div style={S.modal}>
            <h3 style={S.modalTitle}>Return for Rework</h3>
            <p style={S.modalSub}>Provide a clear reason so the employee knows what to fix.</p>
            <textarea
              placeholder="e.g. Target values are too low, please revise goals 2 and 4..."
              value={reworkComment}
              onChange={(e) => setReworkComment(e.target.value)}
              style={S.modalTextarea}
              rows={4}
              autoFocus
            />
            <div style={S.modalActions}>
              <button onClick={() => setReworkModal(null)} style={S.modalCancelBtn}>Cancel</button>
              <button onClick={returnRework} style={S.modalSubmitBtn}>
                <RotateCcw size={14} /> Send Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function GoalEditCard({ goal, token, onSaved }) {
  const [target, setTarget] = useState(goal.target);
  const [weightage, setWeightage] = useState(goal.weightage);
  const [expanded, setExpanded] = useState(false);
  const [saving, setSaving] = useState(false);
  const dirty = target !== goal.target || String(weightage) !== String(goal.weightage);

  const saveGoal = async () => {
    setSaving(true);
    try {
      await axios.put(
        `${API_URL}/api/goals/manager/edit/${goal.id}`,
        { target, weightage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onSaved();
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
    setSaving(false);
  };

  return (
    <div style={G.card}>
      {/* Row summary */}
      <div style={G.summary} onClick={() => setExpanded(!expanded)}>
        <div style={G.summaryLeft}>
          <div style={G.goalTitle}>{goal.title}</div>
          <div style={G.tagRow}>
            <span style={G.tag}>{goal.thrustArea}</span>
            <span style={G.tag}>{goal.uomType}</span>
            <span style={{ ...G.tag, background: "#eef2ff", color: "#1b4fff" }}>{goal.weightage}%</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {dirty && <span style={G.dirtyDot} title="Unsaved changes" />}
          <ChevronDown size={16} color="#9aaac8" style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "0.2s" }} />
        </div>
      </div>

      {/* Expanded edit */}
      {expanded && (
        <div style={G.editArea}>
          <p style={G.desc}>{goal.description}</p>
          <div style={G.editGrid}>
            <div style={G.field}>
              <label style={G.label}>Target Value</label>
              <input
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                style={G.input}
                placeholder="e.g. 95%, 180ms"
              />
            </div>
            <div style={G.field}>
              <label style={G.label}>Weightage (%)</label>
              <input
                type="number"
                min={10}
                max={80}
                value={weightage}
                onChange={(e) => setWeightage(e.target.value)}
                style={G.input}
              />
            </div>
          </div>
          {dirty && (
            <button onClick={saveGoal} disabled={saving} style={G.saveBtn}>
              <Save size={14} /> {saving ? "Saving..." : "Save Changes"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

const S = {
  layout: { display: "flex", minHeight: "100vh", background: "#f4f7ff", fontFamily: "'Segoe UI', sans-serif" },
  main: { flex: 1, padding: "28px 32px", overflowY: "auto" },
  topbar: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" },
  pageTitle: { fontSize: "22px", fontWeight: "700", color: "#0f1f5c", margin: 0 },
  pageSubtitle: { fontSize: "14px", color: "#6b7a99", margin: "2px 0 0" },
  avatar: { width: "38px", height: "38px", borderRadius: "10px", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "15px" },
  pendingBadge: { display: "flex", alignItems: "center", gap: "6px", background: "#fef3c7", color: "#f59e0b", fontSize: "13px", fontWeight: "700", padding: "6px 14px", borderRadius: "20px" },

  statsRow: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px", marginBottom: "24px" },
  statCard: { background: "#fff", border: "1.5px solid #e2e8f5", borderRadius: "12px", padding: "16px 20px" },
  statValue: { fontSize: "28px", fontWeight: "700", lineHeight: 1, marginBottom: "4px" },
  statLabel: { fontSize: "13px", color: "#6b7a99", fontWeight: "500" },

  emptyState: { textAlign: "center", padding: "60px 0" },

  sheetCard: { background: "#fff", border: "1.5px solid #e2e8f5", borderRadius: "16px", overflow: "hidden" },
  sheetHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 20px", borderBottom: "1px solid #f0f4ff" },
  employeeRow: { display: "flex", alignItems: "center", gap: "12px" },
  empAvatar: { width: "40px", height: "40px", borderRadius: "10px", background: "#eef2ff", color: "#1b4fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "16px" },
  empName: { fontSize: "15px", fontWeight: "700", color: "#0f1f5c" },
  empSub: { fontSize: "12px", color: "#9aaac8", marginTop: "1px" },
  statusPill: { fontSize: "12px", fontWeight: "700", padding: "4px 12px", borderRadius: "20px" },
  goalCount: { fontSize: "12px", fontWeight: "600", color: "#9aaac8", background: "#f4f7ff", padding: "4px 10px", borderRadius: "20px", border: "1px solid #e2e8f5" },

  sheetFooter: { display: "flex", justifyContent: "flex-end", gap: "10px", padding: "14px 20px", borderTop: "1px solid #f0f4ff", background: "#fafbff" },
  reworkBtn: { display: "flex", alignItems: "center", gap: "7px", padding: "9px 18px", border: "1.5px solid #fca5a5", borderRadius: "10px", background: "#fff", color: "#ef4444", fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "'Segoe UI', sans-serif" },
  approveBtn: { display: "flex", alignItems: "center", gap: "7px", padding: "9px 18px", border: "none", borderRadius: "10px", background: "#10b981", color: "#fff", fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "'Segoe UI', sans-serif" },
  approvedBanner: { display: "flex", alignItems: "center", gap: "8px", padding: "12px 20px", background: "#d1fae5", color: "#059669", fontSize: "13px", fontWeight: "700", borderTop: "1px solid #a7f3d0" },

  modalOverlay: { position: "fixed", inset: 0, background: "rgba(15,31,92,0.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 },
  modal: { background: "#fff", borderRadius: "16px", padding: "28px", width: "100%", maxWidth: "460px", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" },
  modalTitle: { fontSize: "18px", fontWeight: "700", color: "#0f1f5c", marginBottom: "6px" },
  modalSub: { fontSize: "13px", color: "#6b7a99", marginBottom: "16px" },
  modalTextarea: { width: "100%", padding: "12px 14px", border: "1.5px solid #e2e8f5", borderRadius: "10px", fontSize: "14px", color: "#0f1f5c", fontFamily: "'Segoe UI', sans-serif", boxSizing: "border-box", outline: "none", resize: "vertical" },
  modalActions: { display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "16px" },
  modalCancelBtn: { padding: "9px 18px", border: "1.5px solid #e2e8f5", borderRadius: "10px", background: "#fff", color: "#6b7a99", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "'Segoe UI', sans-serif" },
  modalSubmitBtn: { display: "flex", alignItems: "center", gap: "7px", padding: "9px 18px", border: "none", borderRadius: "10px", background: "#ef4444", color: "#fff", fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "'Segoe UI', sans-serif" },
};

const G = {
  card: { border: "1px solid #f0f4ff", borderRadius: "12px", marginBottom: "10px", overflow: "hidden" },
  summary: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", cursor: "pointer", background: "#fafbff" },
  summaryLeft: { flex: 1, minWidth: 0 },
  goalTitle: { fontSize: "14px", fontWeight: "700", color: "#0f1f5c", marginBottom: "6px" },
  tagRow: { display: "flex", flexWrap: "wrap", gap: "6px" },
  tag: { fontSize: "11px", fontWeight: "600", padding: "3px 9px", borderRadius: "20px", background: "#f4f7ff", color: "#6b7a99", border: "1px solid #e2e8f5" },
  dirtyDot: { width: "8px", height: "8px", borderRadius: "50%", background: "#f59e0b", display: "inline-block" },
  editArea: { padding: "14px 16px", background: "#fff", borderTop: "1px solid #f0f4ff" },
  desc: { fontSize: "13px", color: "#6b7a99", marginBottom: "14px", lineHeight: 1.5 },
  editGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" },
  field: { display: "flex", flexDirection: "column", gap: "5px" },
  label: { fontSize: "11px", fontWeight: "700", color: "#3d4f7c", textTransform: "uppercase", letterSpacing: "0.4px" },
  input: { padding: "9px 12px", border: "1.5px solid #e2e8f5", borderRadius: "9px", fontSize: "14px", color: "#0f1f5c", outline: "none", fontFamily: "'Segoe UI', sans-serif", boxSizing: "border-box" },
  saveBtn: { display: "flex", alignItems: "center", gap: "7px", padding: "8px 16px", border: "none", borderRadius: "9px", background: "#1b4fff", color: "#fff", fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "'Segoe UI', sans-serif" },
};

export default ManagerApprovals;