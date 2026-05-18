// CompletionDashboard.jsx
import { useState } from "react";
import axios from "axios";
import { Search } from "lucide-react";
import {
  AdminLayout,
  StyledTable,
  Toolbar,
  Select,
  PrimaryBtn,
  StatusBadge,
} from "./AdminLayout";
const API_URL = import.meta.env.VITE_API_URL;
const QUARTER_OPTIONS = [
  { value: "Q1", label: "Q1" },
  { value: "Q2", label: "Q2" },
  { value: "Q3", label: "Q3" },
  { value: "Q4", label: "Q4" },
];

const BOOL_MAP = {
  true:  { label: "Yes", bg: "#d1fae5", color: "#065f46" },
  false: { label: "No",  bg: "#fee2e2", color: "#991b1b" },
};

function ProgressBar({ value }) {
  const pct = Math.min(Number(value) || 0, 100);
  const color = pct >= 80 ? "#10b981" : pct >= 40 ? "#f59e0b" : "#ef4444";
  return (
    <div style={S.barWrap}>
      <div style={S.barBg}>
        <div style={{ ...S.barFill, width: `${pct}%`, background: color }} />
      </div>
      <span style={{ ...S.barLabel, color }}>{pct}%</span>
    </div>
  );
}

const COLUMNS = [
  { key: "employeeName", label: "Employee" },
  {
    key: "goalSheetApproved",
    label: "Sheet Approved",
    render: (row) => <StatusBadge value={String(row.goalSheetApproved)} map={BOOL_MAP} />,
  },
  { key: "totalGoals",        label: "Total Goals"     },
  { key: "submittedCheckins", label: "Submitted Check-ins" },
  { key: "reviewedCheckins",  label: "Manager Reviewed" },
  {
    key: "employeeCompletion",
    label: "Employee %",
    render: (row) => <ProgressBar value={row.employeeCompletion} />,
  },
  {
    key: "managerReviewCompletion",
    label: "Manager %",
    render: (row) => <ProgressBar value={row.managerReviewCompletion} />,
  },
];

function CompletionDashboard() {
  const [quarter, setQuarter] = useState("Q1");
  const [data,    setData]    = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const fetchCompletion = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_URL}/api/reports/completion?quarter=${quarter}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setData(res.data);
    } catch {
      alert("Failed to fetch completion dashboard");
    } finally {
      setLoading(false);
    }
  };

  // Summary stats
  const avgEmp = data.length
    ? (data.reduce((s, r) => s + Number(r.employeeCompletion || 0), 0) / data.length).toFixed(1)
    : null;
  const avgMgr = data.length
    ? (data.reduce((s, r) => s + Number(r.managerReviewCompletion || 0), 0) / data.length).toFixed(1)
    : null;
  const approved = data.filter((r) => r.goalSheetApproved).length;

  return (
    <AdminLayout
      title="Completion Dashboard"
      subtitle="Track quarterly check-in and review completion rates"
    >
      <Toolbar>
        <Select value={quarter} onChange={setQuarter} options={QUARTER_OPTIONS} />
        <PrimaryBtn onClick={fetchCompletion} disabled={loading}>
          <Search size={15} />
          {loading ? "Loading…" : "Load Completion"}
        </PrimaryBtn>
      </Toolbar>

      {/* Summary cards */}
      {data.length > 0 && (
        <div style={S.statsRow}>
          <StatCard label="Employees"           value={data.length}    />
          <StatCard label="Sheets Approved"     value={approved}       />
          <StatCard label="Avg Employee Completion" value={`${avgEmp}%`} accent="#10b981" />
          <StatCard label="Avg Manager Completion"  value={`${avgMgr}%`} accent="#8b5cf6" />
        </div>
      )}

      <StyledTable
        columns={COLUMNS}
        rows={data}
        emptyText="Select a quarter and click Load Completion."
      />
    </AdminLayout>
  );
}

function StatCard({ label, value, accent = "#8b5cf6" }) {
  return (
    <div style={S.statCard}>
      <div style={S.statLabel}>{label}</div>
      <div style={{ ...S.statValue, color: accent }}>{value}</div>
    </div>
  );
}

const S = {
  statsRow: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "16px", marginBottom: "20px" },
  statCard: { background: "#fff", border: "1.5px solid #e2e8f5", borderRadius: "14px", padding: "16px 20px" },
  statLabel:{ fontSize: "11px", fontWeight: "700", color: "#6b7a99", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" },
  statValue:{ fontSize: "26px", fontWeight: "700", lineHeight: 1 },

  barWrap:  { display: "flex", alignItems: "center", gap: "8px", minWidth: "120px" },
  barBg:    { flex: 1, height: "6px", background: "#eef2ff", borderRadius: "99px", overflow: "hidden" },
  barFill:  { height: "100%", borderRadius: "99px", transition: "width 0.3s ease" },
  barLabel: { fontSize: "12px", fontWeight: "700", minWidth: "36px", textAlign: "right" },
};

export default CompletionDashboard;
