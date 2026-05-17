// AdminGoalSheets.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { LockOpen, ChevronDown, ChevronUp } from "lucide-react";
import {
  AdminLayout,
  Card,
  StatusBadge,
  PrimaryBtn,
} from "./AdminLayout";

const STATUS_MAP = {
  pending:  { label: "Pending",  bg: "#fef3c7", color: "#92400e" },
  approved: { label: "Approved", bg: "#d1fae5", color: "#065f46" },
  rejected: { label: "Rejected", bg: "#fee2e2", color: "#991b1b" },
  draft:    { label: "Draft",    bg: "#e2e8f5", color: "#3d4f7c" },
};

function GoalRow({ goal }) {
  return (
    <div style={S.goalRow}>
      <div style={S.goalTitle}>{goal.title}</div>
      <div style={S.goalMeta}>
        <span style={S.metaChip}>Target: {goal.target}</span>
        <span style={S.metaChip}>{goal.weightage}% weight</span>
      </div>
    </div>
  );
}

function SheetCard({ sheet, onUnlock }) {
  const [open, setOpen] = useState(false);

  return (
    <Card>
      {/* Header row */}
      <div style={S.sheetHeader}>
        <div style={S.sheetLeft}>
          <div style={S.employeeAvatar}>
            {sheet.employee?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={S.employeeName}>{sheet.employee?.name}</div>
            <div style={S.employeeEmail}>{sheet.employee?.email}</div>
          </div>
        </div>

        <div style={S.sheetRight}>
          <StatusBadge value={sheet.status} map={STATUS_MAP} />
          <span style={{ ...S.lockedBadge, ...(sheet.isLocked ? S.lockedOn : S.lockedOff) }}>
            {sheet.isLocked ? "🔒 Locked" : "🔓 Unlocked"}
          </span>
          <PrimaryBtn onClick={() => onUnlock(sheet.id)}>
            <LockOpen size={14} />
            Unlock
          </PrimaryBtn>
          <button style={S.expandBtn} onClick={() => setOpen((v) => !v)}>
            {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Goals */}
      {open && (
        <div style={S.goalList}>
          <div style={S.goalListTitle}>{sheet.Goals?.length ?? 0} Goals</div>
          {sheet.Goals?.map((goal) => (
            <GoalRow key={goal.id} goal={goal} />
          ))}
        </div>
      )}
    </Card>
  );
}

function AdminGoalSheets() {
  const [sheets, setSheets] = useState([]);
  const token = localStorage.getItem("token");

  const fetchSheets = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/goal-sheets", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSheets(res.data);
    } catch {
      alert("Failed to fetch goal sheets");
    }
  };

  const unlockSheet = async (sheetId) => {
    const reason = prompt("Enter reason for unlocking this goal sheet:");
    if (!reason) { alert("Reason is required"); return; }
    try {
      const res = await axios.put(
        `http://localhost:5000/api/admin/unlock-goal-sheet/${sheetId}`,
        { reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.message);
      fetchSheets();
    } catch (err) {
      alert(err.response?.data?.message || "Unlock failed");
    }
  };

  useEffect(() => { fetchSheets(); }, []);

  return (
    <AdminLayout
      title="Goal Sheet Management"
      subtitle="Review, unlock, and manage employee goal sheets"
    >
      {sheets.length === 0 ? (
        <div style={S.empty}>No goal sheets found.</div>
      ) : (
        sheets.map((sheet) => (
          <SheetCard key={sheet.id} sheet={sheet} onUnlock={unlockSheet} />
        ))
      )}
    </AdminLayout>
  );
}

const S = {
  sheetHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" },
  sheetLeft:   { display: "flex", alignItems: "center", gap: "14px" },
  sheetRight:  { display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" },
  employeeAvatar: { width: "42px", height: "42px", borderRadius: "12px", background: "#8b5cf6", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "16px", flexShrink: 0 },
  employeeName:  { fontSize: "15px", fontWeight: "700", color: "#0f1f5c" },
  employeeEmail: { fontSize: "12px", color: "#6b7a99", marginTop: "2px" },

  lockedBadge: { fontSize: "12px", fontWeight: "600", padding: "4px 10px", borderRadius: "20px" },
  lockedOn:    { background: "#fee2e2", color: "#991b1b" },
  lockedOff:   { background: "#d1fae5", color: "#065f46" },

  expandBtn: { background: "#f4f7ff", border: "1.5px solid #e2e8f5", borderRadius: "8px", padding: "6px 8px", cursor: "pointer", display: "flex", alignItems: "center", color: "#6b7a99" },

  goalList:      { marginTop: "16px", borderTop: "1.5px solid #f0f4ff", paddingTop: "14px", display: "flex", flexDirection: "column", gap: "8px" },
  goalListTitle: { fontSize: "11px", fontWeight: "700", color: "#9aaac8", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" },
  goalRow:       { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "#f8faff", borderRadius: "10px", gap: "12px", flexWrap: "wrap" },
  goalTitle:     { fontSize: "14px", fontWeight: "600", color: "#0f1f5c", flex: 1 },
  goalMeta:      { display: "flex", gap: "8px" },
  metaChip:      { fontSize: "12px", fontWeight: "600", color: "#6b7a99", background: "#eef2ff", padding: "3px 10px", borderRadius: "20px" },

  empty: { textAlign: "center", padding: "60px", color: "#9aaac8", fontSize: "14px" },
};

export default AdminGoalSheets;
